const sqlite3 = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '.tmp/data.db');
const db = sqlite3(dbPath, { readonly: true });

const tables = ['residential_listings', 'commercial_listings', 'land_listings'];
for (const t of tables) {
    try {
        const count = db.prepare(`SELECT count(*) as cnt FROM ${t}`).get();
        const statuses = db.prepare(`SELECT verification_status, count(*) as cnt FROM ${t} GROUP BY verification_status`).all();
        console.log(`Table: ${t} | Total: ${count.cnt}`);
        console.log('  Statuses:', statuses);
        const rows = db.prepare(`SELECT id, city, district, verification_status FROM ${t}`).all();
        console.log('  Rows:', rows);
    } catch (e) {
        console.log(`Table: ${t} | Error:`, e.message);
    }
}

db.close();
