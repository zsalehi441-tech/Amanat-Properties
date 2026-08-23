const path = require('path');
const sqlite3 = require('./amanat-admin/node_modules/better-sqlite3');
const fs = require('fs');

const dbPath = path.join(__dirname, 'amanat-admin/.tmp/data.db');
const db = sqlite3(dbPath, { readonly: true });

const tables = ['residential_listings', 'commercial_listings', 'land_listings'];
console.log('=== Checking Strapi DB Listings ===');
for (const t of tables) {
    const rows = db.prepare(`SELECT id, city, district, verification_status, description_dari, description_pashto, description_english FROM ${t}`).all();
    console.log(`\nTable: ${t} (${rows.length} rows)`);
    const statusCounts = {};
    const titleSeen = {};
    const dupes = [];
    rows.forEach(r => {
        statusCounts[r.verification_status] = (statusCounts[r.verification_status] || 0) + 1;
        const key = (r.description_dari || r.description_english || '').trim().substring(0, 50);
        if (titleSeen[key]) {
            dupes.push({ id: r.id, originalId: titleSeen[key], key });
        } else {
            titleSeen[key] = r.id;
        }
    });
    console.log('  Status counts:', statusCounts);
    if (dupes.length > 0) {
        console.log('  Duplicates found:', dupes);
    } else {
        console.log('  No duplicates found.');
    }
}

const listingsPath = path.join(__dirname, 'amanat-web/public/data/listings.json');
if (fs.existsSync(listingsPath)) {
    const listings = JSON.parse(fs.readFileSync(listingsPath, 'utf8'));
    console.log(`\n=== Checking listings.json (${listings.length} items) ===`);
    const idMap = {};
    const descMap = {};
    const duplicateIds = [];
    const duplicateDescs = [];
    listings.forEach((item, index) => {
        if (idMap[item.id]) {
            duplicateIds.push({ id: item.id, index, previousIndex: idMap[item.id] });
        } else {
            idMap[item.id] = index;
        }
        const descKey = (item.description.dr || item.description.en || '').trim().substring(0, 50);
        if (descKey && descMap[descKey]) {
            duplicateDescs.push({ id: item.id, previousId: descMap[descKey], descSnippet: descKey });
        } else if (descKey) {
            descMap[descKey] = item.id;
        }
    });
    console.log('Duplicate IDs in listings.json:', duplicateIds.length > 0 ? duplicateIds : 'None');
    console.log('Duplicate Descriptions in listings.json:', duplicateDescs.length > 0 ? duplicateDescs : 'None');
}

db.close();
