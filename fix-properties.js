// fix-properties.js
// Script to update properties.json with existing hero images

const fs = require('fs');
const path = require('path');

const propertiesFile = path.join(__dirname, 'properties.json');
const properties = JSON.parse(fs.readFileSync(propertiesFile, 'utf8'));

// Map property types to existing hero images
const imageMap = {
    'Villa': ['hero-villa.jpg'],
    'Apartment': ['hero-apartment.jpg'],
    'Commercial': ['hero-commercial.jpg'],
    'House': ['hero-villa.jpg'], // Use villa image as fallback for houses
    'Land': ['hero-commercial.jpg'] // Use commercial image as fallback for land
};

// Update each property's images
properties.properties.forEach(property => {
    const type = property.type;
    if (imageMap[type]) {
        property.images = imageMap[type];
        console.log(`Updated property ${property.id} (${property.title}) with image: ${imageMap[type][0]}`);
    } else {
        // Default fallback
        property.images = ['hero-villa.jpg'];
        console.log(`Updated property ${property.id} (${property.title}) with default image: hero-villa.jpg`);
    }
});

// Write updated properties back to file
fs.writeFileSync(propertiesFile, JSON.stringify(properties, null, 2), 'utf8');
console.log('\n✅ Successfully updated properties.json with existing images!');

