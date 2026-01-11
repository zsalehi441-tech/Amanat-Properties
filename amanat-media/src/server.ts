import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import multipart from '@fastify/multipart';
import cors from '@fastify/cors';
import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import dotenv from 'dotenv';
import { pipeline } from 'stream';
import { promisify } from 'util';

dotenv.config();

const pump = promisify(pipeline);

// Configuration
const PORT = parseInt(process.env.PORT || '3001');
const API_KEY = process.env.API_KEY;

// SECURITY: Require API_KEY environment variable
if (!API_KEY) {
    console.error('FATAL: API_KEY environment variable is not set. Server cannot start.');
    process.exit(1);
}
// Default to ../.media-data relative to this project root
const MEDIA_ROOT = process.env.MEDIA_ROOT || path.resolve(__dirname, '../../.media-data');
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}/public`;

const PROPERTY_DIR = path.join(MEDIA_ROOT, 'property');
const DOCUMENTS_DIR = path.join(MEDIA_ROOT, 'documents');

// Ensure directories exist
fs.ensureDirSync(PROPERTY_DIR);
fs.ensureDirSync(DOCUMENTS_DIR);

const fastify: FastifyInstance = Fastify({ logger: true });

fastify.register(cors);
fastify.register(multipart, {
    limits: {
        fileSize: 20 * 1024 * 1024, // 20 MB limit
    }
});

// Middleware for API Key validation
const requireApiKey = async (request: FastifyRequest, reply: FastifyReply) => {
    const key = request.headers['x-api-key'];
    if (key !== API_KEY) {
        reply.code(401).send({ error: 'Unauthorized: Invalid API Key' });
        throw new Error('Unauthorized');
    }
};

// Helper: Compute SHA256 of a file
const computeHash = async (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);
        stream.on('error', err => reject(err));
        stream.on('data', chunk => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
    });
};

// Route: Health Check
fastify.get('/health', async () => {
    return { status: 'ok', uptime: process.uptime() };
});

// Route: Upload Property Image
fastify.post('/upload/property', { preHandler: requireApiKey }, async (req, reply) => {
    const data = await req.file();
    if (!data) {
        return reply.code(400).send({ error: 'No file uploaded' });
    }

    const mediaId = uuidv4();
    const mediaDir = path.join(PROPERTY_DIR, mediaId);
    await fs.ensureDir(mediaDir);

    // Determine extension from mimetype or original filename
    let ext = path.extname(data.filename).toLowerCase();
    if (!ext) ext = '.jpg'; // Fallback

    const originalPath = path.join(mediaDir, `original${ext}`);

    // Save original
    await pump(data.file, fs.createWriteStream(originalPath));

    // Compute Checksum
    const hash = await computeHash(originalPath);

    // Extract Metadata & Validate Image
    let metadata;
    try {
        metadata = await sharp(originalPath).metadata();
    } catch (err) {
        // If sharp fails, it's not a valid image
        await fs.remove(mediaDir);
        return reply.code(400).send({ error: 'Invalid image file' });
    }

    const metaInfo = {
        originalName: data.filename,
        mime: data.mimetype,
        size: (await fs.stat(originalPath)).size,
        width: metadata.width,
        height: metadata.height,
        hash: hash,
        created: new Date().toISOString(),
        type: 'property'
    };

    await fs.writeJson(path.join(mediaDir, 'meta.json'), metaInfo);

    // Generate Variants
    const variants = ['thumb', 'cover', 'full'];
    const sizes = { thumb: 400, cover: 1200, full: 1600 };

    const variantUrls: Record<string, string> = {};
    const failedVariants: string[] = [];

    for (const variant of variants) {
        try {
            const width = sizes[variant as keyof typeof sizes];
            const outputPath = path.join(mediaDir, `${variant}.webp`);

            await sharp(originalPath)
                .resize({ width, withoutEnlargement: true })
                .webp({ quality: 80, effort: 4 })
                .toFile(outputPath);

            variantUrls[variant] = `${PUBLIC_BASE_URL}/${mediaId}/${variant}`;
        } catch (variantErr) {
            req.log.error({ variant, error: variantErr }, `Failed to generate ${variant} variant`);
            failedVariants.push(variant);
        }
    }

    return {
        id: mediaId,
        variants: variantUrls,
        meta: metaInfo,
        ...(failedVariants.length > 0 && {
            warning: `Some variants failed to generate: ${failedVariants.join(', ')}`,
            failedVariants
        })
    };
});

// Route: Upload Document
fastify.post('/upload/document', { preHandler: requireApiKey }, async (req, reply) => {
    const data = await req.file();
    if (!data) {
        return reply.code(400).send({ error: 'No file uploaded' });
    }

    const mediaId = uuidv4();
    const mediaDir = path.join(DOCUMENTS_DIR, mediaId);
    await fs.ensureDir(mediaDir);

    // Determine extension
    let ext = path.extname(data.filename).toLowerCase();
    if (!ext) ext = '.dat'; // Fallback for unknown binary

    const originalPath = path.join(mediaDir, `original${ext}`);

    // Save original
    await pump(data.file, fs.createWriteStream(originalPath));

    // Compute Checksum
    const hash = await computeHash(originalPath);

    // Generate Preview if it's an image
    let isImage = false;
    let metadata;

    if (data.mimetype.startsWith('image/')) {
        try {
            metadata = await sharp(originalPath).metadata();
            isImage = true;

            // Generate secure preview (not public)
            await sharp(originalPath)
                .resize({ width: 800, withoutEnlargement: true })
                .webp({ quality: 70 })
                .toFile(path.join(mediaDir, 'preview.webp'));

        } catch (err) {
            // Not a processable image, ignore preview
            req.log.warn('Uploaded document claimed to be image but sharp failed or it is not supported');
        }
    }

    const metaInfo = {
        originalName: data.filename,
        mime: data.mimetype,
        size: (await fs.stat(originalPath)).size,
        hash: hash,
        isImage,
        created: new Date().toISOString(),
        type: 'document'
    };

    await fs.writeJson(path.join(mediaDir, 'meta.json'), metaInfo);

    return {
        id: mediaId,
        meta: metaInfo,
        message: "Document stored securely. No public access."
    };
});

// Route: Public Serving (Properties Only)
// GET /public/:id/:variant
fastify.get('/public/:id/:variant', async (req, reply) => {
    const { id, variant } = req.params as { id: string, variant: string };

    // SECURITY: Validate UUID format to prevent directory traversal
    if (!uuidValidate(id)) {
        return reply.code(400).send({ error: 'Invalid media ID format' });
    }

    // Strict validation
    if (!['thumb', 'cover', 'full'].includes(variant)) {
        return reply.code(404).send({ error: 'Not Found' });
    }

    const filePath = path.join(PROPERTY_DIR, id, `${variant}.webp`);

    // Check existence
    if (!fs.existsSync(filePath)) {
        return reply.code(404).send({ error: 'Not Found' });
    }

    // Set Cache Headers
    reply.header('Cache-Control', 'public, max-age=31536000, immutable');
    reply.header('Content-Type', 'image/webp');

    // Stream file
    const stream = fs.createReadStream(filePath);
    return reply.send(stream);
});

// Route: Internal Original (Property or Document)
// GET /internal/:id/original
fastify.get('/internal/:id/original', { preHandler: requireApiKey }, async (req, reply) => {
    const { id } = req.params as { id: string };

    // SECURITY: Validate UUID format to prevent directory traversal
    if (!uuidValidate(id)) {
        return reply.code(400).send({ error: 'Invalid media ID format' });
    }

    // Check Property First
    const propertyDir = path.join(PROPERTY_DIR, id);
    if (fs.existsSync(propertyDir)) {
        // Find absolute path of "original.*"
        const files = await fs.readdir(propertyDir);
        const originalFile = files.find(f => f.startsWith('original.'));
        if (originalFile) {
            const stream = fs.createReadStream(path.join(propertyDir, originalFile));
            const mime = (await fs.readJson(path.join(propertyDir, 'meta.json'))).mime || 'application/octet-stream';
            reply.header('Content-Type', mime);
            return reply.send(stream);
        }
    }

    // Check Documents
    const docDir = path.join(DOCUMENTS_DIR, id);
    if (fs.existsSync(docDir)) {
        const files = await fs.readdir(docDir);
        const originalFile = files.find(f => f.startsWith('original.'));
        if (originalFile) {
            const stream = fs.createReadStream(path.join(docDir, originalFile));
            const mime = (await fs.readJson(path.join(docDir, 'meta.json'))).mime || 'application/octet-stream';
            reply.header('Content-Type', mime);
            return reply.send(stream);
        }
    }

    return reply.code(404).send({ error: 'Not Found' });
});

// Route: Internal Meta
fastify.get('/internal/:id/meta', { preHandler: requireApiKey }, async (req, reply) => {
    const { id } = req.params as { id: string };

    // SECURITY: Validate UUID format to prevent directory traversal
    if (!uuidValidate(id)) {
        return reply.code(400).send({ error: 'Invalid media ID format' });
    }

    // Check Property
    const propMeta = path.join(PROPERTY_DIR, id, 'meta.json');
    if (fs.existsSync(propMeta)) {
        const data = await fs.readJson(propMeta);
        return data;
    }

    // Check Documents
    const docMeta = path.join(DOCUMENTS_DIR, id, 'meta.json');
    if (fs.existsSync(docMeta)) {
        const data = await fs.readJson(docMeta);
        return data;
    }

    return reply.code(404).send({ error: 'Not Found' });
});

// Start Server
const start = async () => {
    try {
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Amanat Media Service running on port ${PORT}`);
        console.log(`Media Root: ${MEDIA_ROOT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
