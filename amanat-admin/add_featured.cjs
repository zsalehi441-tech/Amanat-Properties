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
    
    // Add is_featured to attributes if not exists
    if (!data.attributes.is_featured) {
      // Create a new attributes object with is_featured near the top
      const newAttributes = {
        is_featured: {
          type: "boolean",
          default: false
        },
        ...data.attributes
      };
      
      data.attributes = newAttributes;
      fs.writeFileSync(fullPath, JSON.stringify(data, null, 4), 'utf8');
      console.log(`Updated ${schemaPath} with is_featured flag`);
    } else {
      console.log(`is_featured already in ${schemaPath}`);
    }
  } catch(e) {
    console.error(`Failed to update ${schemaPath}`, e);
  }
});
