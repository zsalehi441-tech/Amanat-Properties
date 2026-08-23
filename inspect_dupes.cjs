const path = require('path');
const sqlite3 = require('./amanat-admin/node_modules/better-sqlite3');

const dbPath = path.join(__dirname, 'amanat-admin/.tmp/data.db');
const db = sqlite3(dbPath, { readonly: true });

console.log('=== Residential ID 1 vs 2 ===');
console.log(db.prepare('SELECT * FROM residential_listings WHERE id IN (1, 2)').all());

console.log('=== Residential ID 4 vs 5 ===');
console.log(db.prepare('SELECT * FROM residential_listings WHERE id IN (4, 5)').all());

console.log('=== Commercial ID 3 vs 5 ===');
console.log(db.prepare('SELECT * FROM commercial_listings WHERE id IN (3, 5)').all());

db.close();
