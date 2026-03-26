const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'data', 'listings.json');
try {
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  data.forEach((item) => {
    if (item.id === 'ghz-com-002') {
      item.active_status = 'Available';
    } else if (item.id === 'ghz-com-001') {
      item.active_status = 'Rented';
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("Updated listings.json: ghz-com-002 Available, ghz-com-001 Rented");
} catch (e) {
  console.error("Error", e);
}
