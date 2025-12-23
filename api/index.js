const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    dbConnected: !!supabaseUrl,
    message: 'Amanat Properties API is running with Supabase integration.'
  });
});

// API Endpoints
app.get('/api/properties', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('date_added', { ascending: false });

    if (error) throw error;
    res.json({ properties: data });
  } catch (e) {
    console.error('Error fetching properties from Supabase:', e);
    // Fallback to empty list or handle error
    res.status(500).json({ error: e.message });
  }
});

// Handle POST (Now works with Supabase!)
app.post('/api/properties', upload.array('images'), async (req, res) => {
  try {
    const propertyData = { ...req.body };

    // Parse JSON fields if they come in as strings (common with FormData)
    if (typeof propertyData.features === 'string') propertyData.features = JSON.parse(propertyData.features);
    if (typeof propertyData.features_fa === 'string') propertyData.features_fa = JSON.parse(propertyData.features_fa);

    const files = req.files || [];
    const imageUrls = [];

    // Upload images to Supabase Storage
    for (const file of files) {
      const fileName = `${Date.now()}-${file.originalname}`;
      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true
        });

      if (error) throw error;

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      imageUrls.push(publicUrl);
    }

    // Merge uploaded image URLs with existing ones (if any)
    const existingImages = propertyData.images ? (typeof propertyData.images === 'string' ? JSON.parse(propertyData.images) : propertyData.images) : [];
    propertyData.images = [...existingImages, ...imageUrls];

    // Remove ID if present (Supabase will generate one)
    delete propertyData.id;

    const { data, error } = await supabase
      .from('properties')
      .insert([propertyData])
      .select();

    if (error) throw error;

    res.status(201).json({
      message: 'Property created successfully',
      property: data[0]
    });
  } catch (e) {
    console.error('Error creating property in Supabase:', e);
    res.status(500).json({ error: e.message });
  }
});

// Handle DELETE
app.delete('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Property deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Handle PUT (Update)
app.put('/api/properties/:id', upload.array('images_new'), async (req, res) => {
  try {
    const { id } = req.params;
    const propertyData = { ...req.body };

    if (typeof propertyData.features === 'string') propertyData.features = JSON.parse(propertyData.features);
    if (typeof propertyData.features_fa === 'string') propertyData.features_fa = JSON.parse(propertyData.features_fa);
    if (typeof propertyData.images === 'string') propertyData.images = JSON.parse(propertyData.images);

    const files = req.files || [];
    const imageUrls = [];

    for (const file of files) {
      const fileName = `${Date.now()}-${file.originalname}`;
      const { error } = await supabase.storage
        .from('property-images')
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      imageUrls.push(publicUrl);
    }

    propertyData.images = [...(propertyData.images || []), ...imageUrls];

    const { data, error } = await supabase
      .from('properties')
      .update(propertyData)
      .eq('id', id)
      .select();

    if (error) throw error;

    res.json({ message: 'Property updated successfully', property: data[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = app;
