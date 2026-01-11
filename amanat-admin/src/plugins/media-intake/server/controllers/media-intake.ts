import type { Core } from '@strapi/strapi';
import type { Context } from 'koa';

interface StrapiFiles {
    file?: {
        filepath: string;
        originalFilename: string;
        mimetype: string;
        size: number;
    };
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
    async ping(ctx: Context) {
        ctx.body = 'pong';
    },

    async uploadProperty(ctx: Context) {
        try {
            const files = ctx.request.files as StrapiFiles | undefined;
            console.log('Media Intake: uploadProperty requested');
            console.log('File keys:', files ? Object.keys(files) : 'No files object');

            if (!files || !files.file) {
                console.error('Media Intake Error: No file found in request');
                return ctx.badRequest('No file uploaded');
            }

            const data = await strapi
                .plugin('media-intake')
                .service('mediaIntake')
                .uploadProperty(files.file);

            ctx.body = data;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            console.error('Media Intake Controller Error:', err);
            return ctx.badRequest('Upload failed', { error: message });
        }
    },

    async uploadDocument(ctx: Context) {
        try {
            const files = ctx.request.files as StrapiFiles | undefined;
            console.log('Media Intake: uploadDocument requested');

            if (!files || !files.file) {
                console.error('Media Intake Error: No file found in request');
                return ctx.badRequest('No file uploaded');
            }

            const data = await strapi
                .plugin('media-intake')
                .service('mediaIntake')
                .uploadDocument(files.file);

            ctx.body = data;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            console.error('Media Intake Controller Error:', err);
            return ctx.badRequest('Upload failed', { error: message });
        }
    }
});
