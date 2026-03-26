const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'data', 'listings.json');
try {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  data.forEach((item) => {
    // we want all properties to have 'is_featured' as true by default so they display on the homepage for now 
    // until the admin toggles them or fetches strictly from Strapi later.
    item.is_featured = true;
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("Updated listings.json: Added is_featured=true to all properties");
} catch (e) {
  console.error("Error", e);
}
