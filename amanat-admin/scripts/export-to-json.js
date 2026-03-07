const sqlite3 = require('better-sqlite3');
const fs = require('fs-extra');
const path = require('path');

// Paths
const DB_PATH = path.join(__dirname, '../.tmp/data.db');
const OUTPUT_PATH = path.join(__dirname, '../../amanat-web/public/data/listings.json');

// Check if database exists
if (!fs.existsSync(DB_PATH)) {
    console.error('❌ Database not found at:', DB_PATH);
    console.error('Make sure Strapi has been started at least once.');
    process.exit(1);
}

console.log('📦 Connecting to Strapi database...');
const db = sqlite3(DB_PATH, { readonly: true });

// Helper: Get images for a listing
function getImages(listingId, tableName) {
    const componentName = tableName.replace('_listings', '_listing');
    const linkTableName = `${tableName}_images_links`;

    try {
        const rows = db.prepare(`
            SELECT c.url 
            FROM components_shared_image_urls c
            INNER JOIN ${linkTableName} l 
                ON c.id = l.image_url_id
            WHERE l.${componentName}_id = ?
            ORDER BY l.image_url_order ASC
        `).all(listingId);

        return rows.map(r => r.url);
    } catch (err) {
        console.warn(`⚠️  Could not fetch images for ${tableName} ID ${listingId}:`, err.message);
        return [];
    }
}

// Fetch residential listings
function getResidentialListings() {
    const rows = db.prepare(`
        SELECT * FROM residential_listings 
        WHERE verification_status = 'Published'
    `).all();

    return rows.map((row, index) => ({
        id: String(index + 1),
        title: {
            dr: row.title_dari || '',
            ps: row.title_pashto || '',
            en: row.title_english || ''
        },
        location: {
            district: row.district || '',
            city: row.city || '',
            dr: `${row.district || ''}, ${row.city || ''}`,
            ps: `${row.district || ''}, ${row.city || ''}`,
            en: `${row.district || ''}, ${row.city || ''}`
        },
        price: parseInt(row.price) || 0,
        currency: row.currency || 'USD',
        type: 'sale',
        status: 'verified',
        features: {
            beds: row.bedrooms || 0,
            baths: row.bathrooms || 0,
            area: row.area_sqm || 0
        },
        images: getImages(row.id, 'residential_listings'),
        description: {
            dr: row.description_dari || '',
            ps: row.description_pashto || '',
            en: row.description_english || ''
        },
        verificationData: {
            deedChecked: true,
            identityVerified: true,
            lawyerApproved: true
        }
    }));
}

// Fetch commercial listings
function getCommercialListings() {
    const rows = db.prepare(`
        SELECT * FROM commercial_listings 
        WHERE verification_status = 'Published'
    `).all();

    return rows.map((row, index) => ({
        id: String(1000 + index + 1), // Offset IDs
        title: {
            dr: row.title_dari || '',
            ps: row.title_pashto || '',
            en: row.title_english || ''
        },
        location: {
            district: row.district || '',
            city: row.city || '',
            dr: `${row.district || ''}, ${row.city || ''}`,
            ps: `${row.district || ''}, ${row.city || ''}`,
            en: `${row.district || ''}, ${row.city || ''}`
        },
        price: parseInt(row.price) || 0,
        currency: row.currency || 'USD',
        type: 'commercial',
        status: 'verified',
        propertyType: row.property_type || 'Office',
        features: {
            beds: row.bedrooms || 0,
            baths: row.bathrooms || 0,
            area: row.area_sqm || 0,
            floors: row.floors || 0,
            parking: row.parking || false
        },
        images: getImages(row.id, 'commercial_listings'),
        description: {
            dr: row.description_dari || '',
            ps: row.description_pashto || '',
            en: row.description_english || ''
        },
        verificationData: {
            deedChecked: true,
            identityVerified: true,
            lawyerApproved: true
        }
    }));
}

// Fetch land listings
function getLandListings() {
    const rows = db.prepare(`
        SELECT * FROM land_listings 
        WHERE verification_status = 'Published'
    `).all();

    return rows.map((row, index) => ({
        id: String(2000 + index + 1), // Offset IDs
        title: {
            dr: row.title_dari || '',
            ps: row.title_pashto || '',
            en: row.title_english || ''
        },
        location: {
            district: row.district || '',
            city: row.city || '',
            dr: `${row.district || ''}, ${row.city || ''}`,
            ps: `${row.district || ''}, ${row.city || ''}`,
            en: `${row.district || ''}, ${row.city || ''}`
        },
        price: parseInt(row.price) || 0,
        currency: row.currency || 'USD',
        type: 'land',
        status: 'verified',
        features: {
            area: row.land_size || 0,
            zoning: row.zoning || 'Unspecified'
        },
        images: getImages(row.id, 'land_listings'),
        description: {
            dr: row.description_dari || '',
            ps: row.description_pashto || '',
            en: row.description_english || ''
        },
        verificationData: {
            deedChecked: true,
            identityVerified: true,
            lawyerApproved: true
        }
    }));
}

// Main export
try {
    console.log('🔍 Querying listings...');

    const residential = getResidentialListings();
    const commercial = getCommercialListings();
    const land = getLandListings();

    const allListings = [...residential, ...commercial, ...land];

    console.log(`✅ Found ${allListings.length} published listings:`);
    console.log(`   - Residential: ${residential.length}`);
    console.log(`   - Commercial: ${commercial.length}`);
    console.log(`   - Land: ${land.length}`);

    // Write to file
    fs.ensureDirSync(path.dirname(OUTPUT_PATH));
    fs.writeJsonSync(OUTPUT_PATH, allListings, { spaces: 4 });

    console.log(`\n💾 Exported to: ${OUTPUT_PATH}`);
    console.log('✨ Done! Commit and push to deploy.');

} catch (err) {
    console.error('❌ Export failed:', err);
    process.exit(1);
} finally {
    db.close();
}
