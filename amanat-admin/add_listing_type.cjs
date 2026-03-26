const fs = require('fs');
const path = require('path');

const schemas = [
  'commercial-listing/content-types/commercial-listing/schema.json',
  'residential-listing/content-types/residential-listing/schema.json',
  'land-listing/content-types/land-listing/schema.json',
];

schemas.forEach(schemaPath => {
  const fullPath = path.join(__dirname, 'src', 'api', schemaPath);
  try {
    const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    
    // Add listing_type to attributes if not exists
    if (!data.attributes.listing_type) {
      // Create a new attributes object with listing_type at the top
      const newAttributes = {
        listing_type: {
          type: "enumeration",
          enum: [
            "Sale",
            "Rent",
            "Gerawi"
          ],
          default: "Sale",
          required: true
        },
        ...data.attributes
      };
      
      data.attributes = newAttributes;
      fs.writeFileSync(fullPath, JSON.stringify(data, null, 4), 'utf8');
      console.log(`Updated ${schemaPath}`);
    }
  } catch(e) {
    console.error(`Failed to update ${schemaPath}`, e);
  }
});
