// test-server.js
// Test script to verify server dependencies are installed correctly

const express = require('express');
const fs = require('fs');
const path = require('path');

console.log('Testing server dependencies...\n');

try {
    const app = express();
    console.log('✅ Express loaded successfully');
    
    const multer = require('multer');
    console.log('✅ Multer loaded successfully');
    
    const cors = require('cors');
    console.log('✅ CORS loaded successfully');
    
    // Check if properties.json exists
    const propsFile = path.join(__dirname, '..', 'properties.json');
    if (fs.existsSync(propsFile)) {
        console.log('✅ properties.json found');
    } else {
        console.log('⚠️  properties.json not found');
    }
    
    // Check uploads directory
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (fs.existsSync(uploadsDir)) {
        console.log('✅ uploads directory exists');
    } else {
        console.log('ℹ️  uploads directory will be created on first server start');
    }
    
    console.log('\n✅ All dependencies are installed correctly!');
    console.log('You can now start the server with: npm start');
} catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nPlease run: npm install');
    process.exit(1);
}

