const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

const app = express();
const DATA_FILE = path.join(process.cwd(), 'public', 'properties.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// For Vercel, we use /tmp for temporary uploads if needed, 
// but since the file system is read-only, we should warn the user.
// However, we'll try to use the 'uploads' dir if it exists (local dev) 
// and fallback to /tmp or just memory in production if we had to.
// Actually, Multer can use memoryStorage.
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Utility: load properties
function loadData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(raw);
    return data.properties || [];
  } catch (e) {
    console.error('Error reading data file:', e);
    return [];
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    readOnly: true, // Inform frontend that persistence might not work on Vercel
    message: 'Amanat Properties API is running. Note: Vercel filesystem is read-only. Property updates will not persist between redeploys.'
  });
});

// API Endpoints
app.get('/api/properties', (req, res) => {
  const properties = loadData();
  res.json({ properties });
});

// Handle POST (Note: Persistence won't work on Vercel)
app.post('/api/properties', upload.array('images'), (req, res) => {
  res.status(403).json({
    error: 'Property creation is disabled on Vercel deployment due to read-only filesystem.',
    message: 'To enable property management, please connect a database (like Vercel Postgres or MongoDB).'
  });
});

// Export the app for Vercel
module.exports = app;
