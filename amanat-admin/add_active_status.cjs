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
    if (!data.attributes.active_status) {
      const newAttributes = {
        active_status: {
          type: "enumeration",
          enum: ["Available", "In Negotiation", "Sold"],
          default: "Available",
          required: true
        },
        ...data.attributes
      };
      
      data.attributes = newAttributes;
      fs.writeFileSync(fullPath, JSON.stringify(data, null, 4), 'utf8');
      console.log(`Updated ${schemaPath} with active_status`);
    } else {
      console.log(`active_status already present in ${schemaPath}`);
    }
  } catch(e) {
    console.error(`Failed to update ${schemaPath}`, e);
  }
});
