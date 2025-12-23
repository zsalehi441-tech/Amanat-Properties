const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, '..', 'properties.json');
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

const multer = require('multer');
// Configure multer to save files to UPLOAD_DIR with stable names and limits
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '';
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]/gi, '_');
    cb(null, `${base}-${Date.now()}${ext}`);
  }
});
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
const MAX_FILES = 30;
const upload = multer({ 
  storage,
  limits: { 
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES // Note: This may not work in all multer versions, we'll validate manually
  },
  fileFilter: function (req, file, cb) {
    console.log('[Multer] Processing file:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    // Accept only image mime types
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      const err = new Error('INVALID_FILE_TYPE');
      err.code = 'INVALID_FILE_TYPE';
      console.error('[Multer] Invalid file type:', file.mimetype);
      cb(err);
    }
  }
});

// Serve site root and uploads
app.use('/', express.static(path.join(__dirname, '..')));
app.use('/uploads', express.static(UPLOAD_DIR, {
  setHeaders: (res, filePath) => {
    // Set proper headers for images
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.gif')) {
      res.setHeader('Content-Type', 'image/gif');
    } else if (filePath.endsWith('.webp')) {
      res.setHeader('Content-Type', 'image/webp');
    }
  }
}));

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Utility: load properties from file
function loadData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify({ properties: [] }, null, 2));
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw).properties || [];
  } catch (e) {
    console.error('Error reading data file:', e);
    return [];
  }
}

// Utility: save properties to file
function saveData(properties) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ properties }, null, 2));
    return true;
  } catch (e) {
    console.error('Error writing data file:', e);
    return false;
  }
}

// Helper: save a data URL image to uploads and return relative path
function saveDataUrlImage(dataUrl, targetBaseName) {
  const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) return null;
  const mime = match[1];
  const ext = mime.split('/')[1].replace('jpeg', 'jpg');
  const base64 = match[2];
  const fileName = `${targetBaseName}-${Date.now()}.${ext}`;
  const filePath = path.join(UPLOAD_DIR, fileName);
  try {
    fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
    // Verify file was saved
    if (fs.existsSync(filePath)) {
      console.log('[saveDataUrlImage] File saved successfully:', filePath);
      // Return path with leading slash for web access
      return `/uploads/${fileName}`;
    } else {
      console.error('[saveDataUrlImage] File was not created:', filePath);
      return null;
    }
  } catch (e) {
    console.error('[saveDataUrlImage] Failed to save image:', e);
    return null;
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: PORT,
    version: '1.0.0'
  });
});

// API Endpoints
app.get('/api/properties', (req, res) => {
  const properties = loadData();
  res.json({ properties });
});

// Accept both JSON and multipart/form-data (files under field name 'images')
app.post('/api/properties', upload.array('images'), (req, res) => {
  try {
    console.log('[POST /api/properties] Request received');
    console.log('[POST /api/properties] Files received:', req.files ? req.files.length : 0);
    if (req.files && req.files.length > 0) {
      console.log('[POST /api/properties] File details:', req.files.map(f => ({
        filename: f.filename,
        originalname: f.originalname,
        size: f.size,
        mimetype: f.mimetype,
        path: f.path
      })));
    }
    
    const properties = loadData();
    // If multipart was used, fields are in req.body and files in req.files
    const incoming = Object.assign({}, req.body || {});

    // Normalize fields (some may come as JSON strings)
    if (incoming.features && typeof incoming.features === 'string') {
      try { incoming.features = JSON.parse(incoming.features); } catch (e) { incoming.features = incoming.features.split(',').map(s => s.trim()); }
    }
    if (incoming.images && typeof incoming.images === 'string') {
      try { incoming.images = JSON.parse(incoming.images); } catch (e) { incoming.images = [incoming.images]; }
    }

    const newProperty = Object.assign({}, incoming);
    if (!newProperty.id) newProperty.id = Date.now();

    // If files were uploaded via multipart, use them
    if (Array.isArray(req.files) && req.files.length > 0) {
      // Validate file count
      if (req.files.length > MAX_FILES) {
        console.error('[POST /api/properties] Too many files:', req.files.length, 'max:', MAX_FILES);
        return res.status(400).json({ error: `Too many files uploaded. Maximum ${MAX_FILES} files allowed.` });
      }
      
      console.log('[POST /api/properties] Processing', req.files.length, 'uploaded files');
      const saved = req.files.map(f => {
        // Use forward slash for web paths, ensure it starts with /uploads/
        const filePath = `/uploads/${f.filename}`;
        // Verify file actually exists on disk
        const fullPath = path.join(UPLOAD_DIR, f.filename);
        if (fs.existsSync(fullPath)) {
          const stats = fs.statSync(fullPath);
          console.log('[POST /api/properties] File verified on disk:', {
            path: fullPath,
            size: stats.size,
            webPath: filePath
          });
          return filePath;
        } else {
          console.error('[POST /api/properties] ERROR: File not found on disk:', fullPath);
          return filePath; // Still return path, but log error
        }
      });
      newProperty.images = saved;
      console.log('[POST /api/properties] Image paths set:', saved);
    } else if (Array.isArray(newProperty.images) && newProperty.images.length > 0) {
      // If images were provided as data URLs in JSON body, save them to files
      console.log('[POST /api/properties] Processing data URL images');
      const savedImages = [];
      newProperty.images.forEach((img, idx) => {
        if (typeof img === 'string' && img.startsWith('data:')) {
          const saved = saveDataUrlImage(img, `prop-${newProperty.id}-${idx}`);
          if (saved) savedImages.push(saved);
        } else if (typeof img === 'string') {
          savedImages.push(img);
        }
      });
      newProperty.images = savedImages.length ? savedImages : (newProperty.images || ['hero-villa.jpg']);
    } else {
      newProperty.images = newProperty.images || ['hero-villa.jpg'];
      console.log('[POST /api/properties] Using default image:', newProperty.images);
    }

    // Coerce numeric fields
    if (newProperty.price) newProperty.price = parseInt(newProperty.price);

    properties.push(newProperty);
    const ok = saveData(properties);
    if (ok) {
      console.log('[POST /api/properties] Property saved successfully. ID:', newProperty.id, 'Images:', newProperty.images);
      res.status(201).json({ property: newProperty });
    } else {
      console.error('[POST /api/properties] Failed to save property data');
      res.status(500).json({ error: 'Failed to save property' });
    }
  } catch (error) {
    console.error('[POST /api/properties] Error processing request:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Accept multipart for updates as well
app.put('/api/properties/:id', upload.array('images'), (req, res) => {
  const id = parseInt(req.params.id);
  const properties = loadData();
  const idx = properties.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  const incoming = Object.assign({}, req.body || {});
  if (incoming.features && typeof incoming.features === 'string') {
    try { incoming.features = JSON.parse(incoming.features); } catch (e) { incoming.features = incoming.features.split(',').map(s => s.trim()); }
  }

  const updated = Object.assign({}, properties[idx], incoming);

  if (Array.isArray(req.files) && req.files.length > 0) {
    console.log('[PUT /api/properties/:id] Processing', req.files.length, 'uploaded files');
    updated.images = req.files.map(f => {
      const filePath = `/uploads/${f.filename}`;
      const fullPath = path.join(UPLOAD_DIR, f.filename);
      if (fs.existsSync(fullPath)) {
        console.log('[PUT /api/properties/:id] File verified:', filePath);
      } else {
        console.error('[PUT /api/properties/:id] File not found:', fullPath);
      }
      return filePath;
    });
  } else if (Array.isArray(updated.images) && updated.images.length > 0) {
    const savedImages = [];
    updated.images.forEach((img, i) => {
      if (typeof img === 'string' && img.startsWith('data:')) {
        const saved = saveDataUrlImage(img, `prop-${updated.id}-${i}`);
        if (saved) savedImages.push(saved);
      } else if (typeof img === 'string') {
        savedImages.push(img);
      }
    });
    if (savedImages.length) updated.images = savedImages;
  }

  if (updated.price) updated.price = parseInt(updated.price);

  properties[idx] = updated;
  const ok = saveData(properties);
  if (ok) res.json({ property: updated });
  else res.status(500).json({ error: 'Failed to save' });
});

app.delete('/api/properties/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let properties = loadData();
  const before = properties.length;
  properties = properties.filter(p => p.id !== id);
  if (properties.length === before) return res.status(404).json({ error: 'Not found' });
  const ok = saveData(properties);
  if (ok) res.json({ success: true });
  else res.status(500).json({ error: 'Failed to save' });
});

// Multer / upload error handler
app.use((err, req, res, next) => {
  if (!err) return next();
  
  console.error('[Error Handler] Error received:', {
    name: err.name,
    code: err.code,
    message: err.message,
    stack: err.stack
  });
  
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    console.error('[Error Handler] Multer error:', err.code);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File too large. Max 5MB per file.' });
    }
    if (err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: `Too many files uploaded. Max ${MAX_FILES} files allowed.` });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err.code === 'INVALID_FILE_TYPE' || err.message === 'INVALID_FILE_TYPE') {
    console.error('[Error Handler] Invalid file type');
    return res.status(400).json({ error: 'Invalid file type. Only image uploads are allowed.' });
  }
  // Other errors — pass through
  console.error('[Error Handler] Unhandled error:', err);
  next(err);
});

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`Amanat Properties server running on http://localhost:${PORT}`);
  console.log('API endpoints: GET/POST/PUT/DELETE /api/properties');
  console.log('Health check: GET /api/health');
});

// Handle server startup errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ ERROR: Port ${PORT} is already in use.`);
    console.error(`   Please either:`);
    console.error(`   1. Stop the process using port ${PORT}`);
    console.error(`   2. Set a different port: PORT=3001 npm start`);
    console.error(`   3. Find and kill the process: netstat -ano | findstr :${PORT}\n`);
  } else if (err.code === 'EACCES') {
    console.error(`\n❌ ERROR: Permission denied. Cannot bind to port ${PORT}.`);
    console.error(`   Please run with administrator privileges or use a port > 1024.\n`);
  } else {
    console.error(`\n❌ ERROR: Failed to start server:`, err.message);
    console.error(`   Error code: ${err.code}\n`);
  }
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nSIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
