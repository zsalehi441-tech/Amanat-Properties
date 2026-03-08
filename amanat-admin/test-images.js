const path = require('path');
const { createStrapi } = require('@strapi/strapi');

async function testImages() {
    const appDir = path.resolve(__dirname);
    const strapi = createStrapi({ distDir: path.join(appDir, 'dist') });

    try {
        await strapi.load();

        const residential = await strapi.entityService.findMany('api::residential-listing.residential-listing', {
            filters: { verification_status: 'Published' },
            populate: ['images']
        });

        for (const res of residential) {
            console.log(`\nListing ID: ${res.id}`);
            if (!res.images || res.images.length === 0) {
                console.log("No images attached in Strapi.");
                continue;
            }

            for (const img of res.images) {
                console.log(`URL: ${img.url}`);
                try {
                    const req = await fetch(img.url, { method: 'HEAD' });
                    console.log(`HEAD status: ${req.status}`);
                } catch (e) {
                    console.log(`HEAD failed: ${e.message}`);
                }
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

testImages();
