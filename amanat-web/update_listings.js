const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'data', 'listings.json');
try {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  data.forEach((item, index) => {
    // Add negotiable flag
    item.negotiable = true;
    
    // Set first commercial property as rent to demonstrate rent section
    if (index === 0) {
      item.type = 'rent';
    }
    
    // Set 3rd property as sold to demonstrate sold label
    if (index === 2) {
      item.status = 'sold';
      // Sold items are not negotiable
      item.negotiable = false;
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("listings.json updated successfully");
} catch (e) {
  console.error("Error updating listings.json", e);
}
