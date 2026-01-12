import type { Core } from '@strapi/strapi';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

interface StrapiFiles {
    file?: {
        filepath: string;
        originalFilename: string;
        mimetype: string;
        size: number;
    };
}

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
    async uploadProperty(ctx: any) {
        try {
            const files = ctx.request.files as StrapiFiles | undefined;
            console.log('Media Intake API: uploadProperty requested');

            if (!files || !files.file) {
                console.error('Media Intake Error: No file found in request');
                return ctx.badRequest('No file uploaded');
            }

            const file = files.file;
            const MEDIA_API_URL = process.env.MEDIA_API_URL || 'http://localhost:3001';
            const MEDIA_API_KEY = process.env.MEDIA_API_KEY;

            if (!MEDIA_API_KEY) {
                throw new Error('MEDIA_API_KEY is not configured');
            }

            const formData = new FormData();
            formData.append('file', fs.createReadStream(file.filepath), file.originalFilename);

            const response = await axios.post(`${MEDIA_API_URL}/upload/property`, formData, {
                headers: {
                    ...formData.getHeaders(),
                    'x-api-key': MEDIA_API_KEY,
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            });

            ctx.body = response.data;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            console.error('Media Intake Controller Error:', err);
            return ctx.badRequest('Upload failed', { error: message });
        }
    },

    async uploadDocument(ctx: any) {
        try {
            const files = ctx.request.files as StrapiFiles | undefined;
            console.log('Media Intake API: uploadDocument requested');

            if (!files || !files.file) {
                return ctx.badRequest('No file uploaded');
            }

            const file = files.file;
            const MEDIA_API_URL = process.env.MEDIA_API_URL || 'http://localhost:3001';
            const MEDIA_API_KEY = process.env.MEDIA_API_KEY;

            if (!MEDIA_API_KEY) {
                throw new Error('MEDIA_API_KEY is not configured');
            }

            const formData = new FormData();
            formData.append('file', fs.createReadStream(file.filepath), file.originalFilename);

            if (ctx.request.body?.docType) {
                formData.append('docType', ctx.request.body.docType as string);
            }

            const response = await axios.post(`${MEDIA_API_URL}/upload/document`, formData, {
                headers: {
                    ...formData.getHeaders(),
                    'x-api-key': MEDIA_API_KEY,
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            });

            ctx.body = response.data;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            console.error('Media Intake Controller Error:', err);
            return ctx.badRequest('Upload failed', { error: message });
        }
    },

    async ping(ctx: any) {
        ctx.body = 'pong';
    }
});

export default controller;
