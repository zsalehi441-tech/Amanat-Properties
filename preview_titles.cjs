const path = require('path');
const sqlite3 = require('./amanat-admin/node_modules/better-sqlite3');

const dbPath = path.join(__dirname, 'amanat-admin/.tmp/data.db');
const db = sqlite3(dbPath, { readonly: true });

function formatTitle(item, type, lang) {
    const desc = lang === 'dr' ? item.description_dari : (lang === 'ps' ? item.description_pashto : item.description_english);
    const firstLine = desc ? desc.split('\n').map(s => s.trim()).find(s => s.length > 0) : '';
    
    if (firstLine && firstLine.length <= 80) {
        return firstLine;
    }
    
    if (lang === 'dr') {
        if (type === 'residential') return `خانه ${item.bedrooms || ''} اتاق خوابه در ${item.district}`;
        if (type === 'commercial') return `${item.property_type || 'ملک تجارتی'} در ${item.district}`;
        return `زمین ${item.area_sqm || item.land_size || ''} متر مربع در ${item.district}`;
    }
    if (lang === 'ps') {
        if (type === 'residential') return `${item.bedrooms || ''} کوټې کور په ${item.district}`;
        if (type === 'commercial') return `${item.property_type || 'تجارتی ملکیت'} په ${item.district}`;
        return `ځمکه ${item.area_sqm || item.land_size || ''} متر مربع په ${item.district}`;
    }
    // English
    if (type === 'residential') return `${item.bedrooms || 0} Bed House in ${item.district} (${item.area_sqm || 0} sqm)`;
    if (type === 'commercial') return `${item.property_type || 'Commercial Property'} in ${item.district} (${item.area_sqm || 0} sqm)`;
    return `Land Plot in ${item.district} (${item.area_sqm || item.land_size || 0} sqm)`;
}

const tables = [
    { name: 'residential_listings', type: 'residential' },
    { name: 'commercial_listings', type: 'commercial' },
    { name: 'land_listings', type: 'land' }
];

tables.forEach(t => {
    const rows = db.prepare(`SELECT * FROM ${t.name} WHERE verification_status = 'Published'`).all();
    console.log(`\n=== ${t.type.toUpperCase()} LISTINGS ===`);
    rows.forEach(r => {
        const titleDr = formatTitle(r, t.type, 'dr');
        const titleEn = formatTitle(r, t.type, 'en');
        console.log(`ID ${r.id}:`);
        console.log(`   DR: ${titleDr}`);
        console.log(`   EN: ${titleEn}`);
    });
});

db.close();
