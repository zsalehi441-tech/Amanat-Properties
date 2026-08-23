const fs = require('fs');
const path = require('path');

const listingsPath = path.join(__dirname, 'amanat-web/public/data/listings.json');
const listings = JSON.parse(fs.readFileSync(listingsPath, 'utf8'));

console.log(`Total listings in listings.json: ${listings.length}\n`);

const ids = new Set();
const duplicateIds = [];
listings.forEach(l => {
    if (ids.has(l.id)) duplicateIds.push(l.id);
    ids.add(l.id);
});

console.log('Duplicate IDs:', duplicateIds.length > 0 ? duplicateIds : 'None (0)');

console.log('\nSample exported titles:');
listings.slice(0, 10).forEach(l => {
    console.log(`[${l.id}] ${l.title.en} | DR: ${l.title.dr.substring(0, 45)}...`);
});
