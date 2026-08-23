const fs = require('fs').promises;
const path = require('path');
const { createStrapi } = require('@strapi/strapi');

async function runExport() {
    console.log('Starting Extract Pipeline...');

    // Initialize Strapi instance (headless)
    const appDir = path.resolve(__dirname, '..');
    const strapi = createStrapi({ distDir: path.join(appDir, 'dist') });

    try {
        await strapi.load();
        console.log('Strapi loaded successfully.');

        // 1. Fetch Published Listings
        // We fetch ALL types.
        // Filter status = 'Published'

        // Mapping helper
        const mapToPublicSchema = async (item, type) => {
            // Generate ID: {CityCode}-{ID}
            const cityCodes = {
                'Kabul': 'kbl',
                'Herat': 'hrt',
                'Mazar-i-Sharif': 'mzr',
                'Kandahar': 'kdr',
                'Jalalabad': 'jlb',
                'Ghazni': 'ghz'
            };
            const prefix = cityCodes[item.city] || 'afg';
            const typeCodes = {
                'residential': 'res',
                'commercial': 'com',
                'land': 'lnd'
            };
            const typePrefix = typeCodes[type] || 'unk';
            const id = `${prefix}-${typePrefix}-${String(item.id).padStart(3, '0')}`;

            // Title Generation (clean first line or structured fallback)
            const getFirstLine = (text) => text ? text.split('\n').map(s => s.trim()).find(s => s.length > 0) || '' : '';

            const rawLineDr = getFirstLine(item.description_dari);
            const rawLinePs = getFirstLine(item.description_pashto);
            const rawLineEn = getFirstLine(item.description_english);

            let titleDr = rawLineDr && rawLineDr.length <= 90 ? rawLineDr : '';
            let titlePs = rawLinePs && rawLinePs.length <= 90 ? rawLinePs : (titleDr || '');
            let titleEn = rawLineEn && rawLineEn.length <= 90 ? rawLineEn : '';

            if (!titleDr) {
                if (type === 'residential') titleDr = `خانه ${item.bedrooms ? item.bedrooms + ' اتاق خوابه ' : ''}در ${item.district}`;
                else if (type === 'commercial') titleDr = `${item.property_type || 'ملک تجارتی'} در ${item.district}`;
                else titleDr = `زمین ${item.area_sqm || item.land_size || ''} متر مربع در ${item.district}`;
            }

            if (!titlePs) {
                if (type === 'residential') titlePs = `${item.bedrooms ? item.bedrooms + ' کوټې ' : ''}کور په ${item.district}`;
                else if (type === 'commercial') titlePs = `${item.property_type || 'تجارتی ملکیت'} په ${item.district}`;
                else titlePs = `ځمکه ${item.area_sqm || item.land_size || ''} متر مربع په ${item.district}`;
            }

            if (!titleEn) {
                const featuresTitle = [];
                if (item.bedrooms) featuresTitle.push(`${item.bedrooms} Bed`);
                if (item.property_type) featuresTitle.push(item.property_type);
                else if (type === 'land') featuresTitle.push('Land');
                else featuresTitle.push('Property');
                titleEn = `${featuresTitle.join(' ')} in ${item.district}`;
            }

            return {
                id: id,
                title: {
                    dr: titleDr,
                    ps: titlePs,
                    en: titleEn
                },
                location: {
                    city: item.city,
                    district: item.district,
                    dr: `${item.city}, ${item.district}`,
                    ps: `${item.city}, ${item.district}`,
                    en: `${item.city}, ${item.district}`
                },
                coordinates: {
                    lat: Number(item.gps_latitude) || 0,
                    lng: Number(item.gps_longitude) || 0
                },
                price: Number(item.price) || 0, // Convert BigInt
                currency: item.currency || 'AFN',
                type: item.listing_type ? item.listing_type.toLowerCase() : 'sale',
                status: "verified",
                negotiable: item.is_negotiable ?? true,
                is_featured: item.is_featured ?? true,
                active_status: item.active_status || 'Available',
                features: {
                    beds: item.bedrooms || 0,
                    baths: item.bathrooms || 0,
                    area: item.area_sqm || item.land_size || 0
                },
                images: item.images ? item.images.map(img => img.url) : [],
                videoUrl: item.video_url || null,
                description: {
                    dr: item.description_dari,
                    ps: item.description_pashto || '',
                    en: item.description_english || ''
                },
                verificationData: {
                    deedChecked: true,
                    identityVerified: true,
                    lawyerApproved: true
                }
            };
        };

        // Queries
        const residential = await strapi.entityService.findMany('api::residential-listing.residential-listing', {
            filters: { verification_status: 'Published' },
            populate: ['images']
        });
        const commercial = await strapi.entityService.findMany('api::commercial-listing.commercial-listing', {
            filters: { verification_status: 'Published' },
            populate: ['images']
        });
        const land = await strapi.entityService.findMany('api::land-listing.land-listing', {
            filters: { verification_status: 'Published' },
            populate: ['images']
        });

        console.log(`Found: ${residential.length} Res, ${commercial.length} Comm, ${land.length} Land`);

        // Merge and Map
        const allListings = await Promise.all([
            ...commercial.map(i => mapToPublicSchema(i, 'commercial')),
            ...land.map(i => mapToPublicSchema(i, 'land')),
            ...residential.map(i => mapToPublicSchema(i, 'residential'))
        ]);

        // Write Outputs
        const outputDir = path.resolve(appDir, '../amanat-web/public/data');

        // 1. All Listings (for search/index)
        await fs.writeFile(path.join(outputDir, 'listings.json'), JSON.stringify(allListings, null, 2));

        // 2. Specific City Files (kabul-residential.json etc)
        // Group keys: {city}-{type}
        const grouped = {};
        const addToGroup = (prefix, data) => {
            if (!grouped[prefix]) grouped[prefix] = [];
            grouped[prefix].push(data);
        };

        for (const i of residential) addToGroup(`${i.city.toLowerCase()}-residential`, await mapToPublicSchema(i, 'residential'));
        for (const i of commercial) addToGroup(`${i.city.toLowerCase()}-commercial`, await mapToPublicSchema(i, 'commercial'));
        for (const i of land) addToGroup(`${i.city.toLowerCase()}-land`, await mapToPublicSchema(i, 'land'));

        for (const [key, items] of Object.entries(grouped)) {
            const filename = `${key}.json`;
            await fs.writeFile(path.join(outputDir, filename), JSON.stringify(items, null, 2));
            console.log(`Generated ${filename}`);
        }

        console.log('Export Complete.');

    } catch (error) {
        console.error('Export Failed:', error);
    } finally {
        // strapi.destroy(); // strapi.destroy() might hang in script? 
        process.exit(0);
    }
}

runExport();
