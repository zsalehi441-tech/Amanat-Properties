import type { Core } from '@strapi/strapi';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

/**
 * Represents an uploaded file from Strapi's multipart parser
 */
interface UploadedFile {
    filepath: string;
    originalFilename: string;
    mimetype: string;
    size: number;
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
    async uploadProperty(file: UploadedFile) {
        return this.proxyUpload(file, 'property');
    },

    async uploadDocument(file: UploadedFile) {
        return this.proxyUpload(file, 'document');
    },

    async proxyUpload(file: UploadedFile, type: 'property' | 'document') {
        const MEDIA_API_URL = process.env.MEDIA_API_URL || 'http://localhost:3001';
        const MEDIA_API_KEY = process.env.MEDIA_API_KEY;

        if (!MEDIA_API_KEY) {
            throw new Error('MEDIA_API_KEY is not configured in Strapi');
        }

        const formData = new FormData();
        formData.append('file', fs.createReadStream(file.filepath), file.originalFilename);

        // Capture docType from the request body if present
        const ctx = strapi.requestContext.get();
        if (ctx?.request?.body?.docType) {
            formData.append('docType', ctx.request.body.docType as string);
        }

        try {
            const response = await axios.post(`${MEDIA_API_URL}/upload/${type}`, formData, {
                headers: {
                    ...formData.getHeaders(),
                    'x-api-key': MEDIA_API_KEY,
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            });

            return response.data;
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.error || error.message
                : 'Unknown error';
            console.error('Media Proxy Error:', message);
            throw new Error(`Failed to forward upload to Media Service: ${message}`);
        }
    }
});
