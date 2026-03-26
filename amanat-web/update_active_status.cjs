const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'data', 'listings.json');
try {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  data.forEach((item, idx) => {
    // Add active_status. Set some to 'In Negotiation' or 'Sold' for visual testing if there's enough properties, else 'Available'
    if (idx === 0) item.active_status = 'In Negotiation';
    else if (idx === 1) item.active_status = 'Sold';
    else item.active_status = 'Available';
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("Updated listings.json: Added active_status to all properties");
} catch (e) {
  console.error("Error", e);
}
