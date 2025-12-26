import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                indexFa: resolve(__dirname, 'index-fa.html'),
                listings: resolve(__dirname, 'listings.html'),
                listingsFa: resolve(__dirname, 'listings-fa.html'),
                details: resolve(__dirname, 'details.html'),
                detailsFa: resolve(__dirname, 'details-fa.html'),
                admin: resolve(__dirname, 'admin.html'),
            },
        },
    },
});
