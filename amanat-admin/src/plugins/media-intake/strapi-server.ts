import type { Core } from '@strapi/strapi';
import server from './server';

export default {
    register({ strapi }: { strapi: Core.Strapi }) {
        console.log('Media Intake Plugin: Registered');
    },

    async bootstrap({ strapi }: { strapi: Core.Strapi }) {
        console.log('Media Intake Plugin: Bootstrap complete');
    },

    ...server,
};
