const path = require('path');
const sqlite3 = require('./amanat-admin/node_modules/better-sqlite3');

const dbPath = path.join(__dirname, 'amanat-admin/.tmp/data.db');
const db = sqlite3(dbPath, { readonly: true });

const tables = ['residential_listings', 'commercial_listings', 'land_listings'];
console.log('=== ALL LISTINGS IN STRAPI DB ===');
tables.forEach(t => {
    const rows = db.prepare(`SELECT id, city, district, price, verification_status FROM ${t}`).all();
    console.log(`\n${t}: ${rows.length} total`);
    rows.forEach(r => {
        console.log(`  ID ${r.id}: ${r.city}, ${r.district} | Price: ${r.price} | Status: ${r.verification_status}`);
    });
});

db.close();
