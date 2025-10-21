const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { prisma } = require('../lib/prisma');
const { requireAnyAuth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir;
    if (file.fieldname === 'profileImage') {
      uploadDir = path.join(__dirname, '../../uploads/profiles');
    } else if (file.fieldname === 'categoryImage') {
      uploadDir = path.join(__dirname, '../../uploads/categories');
    } else if (file.fieldname === 'menuItemImage') {
      uploadDir = path.join(__dirname, '../../uploads/menu-items');
    } else {
      uploadDir = path.join(__dirname, '../../uploads');
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const prefix = file.fieldname === 'profileImage' ? 'profile' : 
                   file.fieldname === 'categoryImage' ? 'category' : 
                   file.fieldname === 'menuItemImage' ? 'menu-item' : 'file';
    cb(null, `${prefix}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Upload profile image endpoint with error handling
router.post('/profile-image', requireAnyAuth(), (req, res, next) => {
  console.log('📸 Profile image upload request received');
  console.log('📋 Headers:', req.headers);
  console.log('📦 Content-Type:', req.headers['content-type']);
  
  upload.single('profileImage')(req, res, (err) => {
    if (err) {
      console.error('❌ Multer error:', err);
      console.error('❌ Error details:', err.message, err.code, err.field);
      return res.status(400).json({ error: err.message || 'File upload error' });
    }
    console.log('✅ Multer processed successfully');
    next();
  });
}, async (req, res) => {
  try {
    console.log('Profile image upload request received');
    console.log('File:', req.file);
    console.log('Body:', req.body);
    console.log('Query:', req.query);
    
    if (!req.file) {
      console.error('No file received in upload request');
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Use userId from query parameter (for admin editing others) or use logged-in user's id
    const userId = req.query.userId || req.body.userId || req.user.id;
    const imagePath = `/uploads/profiles/${req.file.filename}`;

    // If trying to update another user's profile, check if current user is ADMIN
    if (userId !== req.user.id && req.user.role !== 'ADMIN') {
      // Clean up uploaded file
      const filePath = path.join(__dirname, '../../uploads/profiles', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.status(403).json({ error: 'Only admins can update other users profile images' });
    }

    // Update user profile with image path
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profileImage: imagePath },
      select: { id: true, email: true, name: true, role: true, phone: true, profileImage: true }
    });

    return res.json({ 
      success: true, 
      message: 'Profile image uploaded successfully',
      user: updatedUser,
      profileImage: imagePath,
      imageUrl: imagePath
    });

  } catch (error) {
    console.error('Profile image upload error:', error);
    
    // Clean up uploaded file if database update fails
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads/profiles', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    return res.status(500).json({ error: 'Failed to upload profile image' });
  }
});

// Upload category image endpoint
router.post('/category-image', requireAnyAuth(), upload.single('categoryImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imagePath = `/uploads/categories/${req.file.filename}`;

    return res.json({ 
      success: true, 
      message: 'Category image uploaded successfully',
      imageUrl: imagePath
    });

  } catch (error) {
    console.error('Category image upload error:', error);
    
    // Clean up uploaded file if something fails
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads/categories', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    return res.status(500).json({ error: 'Failed to upload category image' });
  }
});

// Upload menu item image endpoint
router.post('/menu-item-image', requireAnyAuth(), upload.single('menuItemImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imagePath = `/uploads/menu-items/${req.file.filename}`;

    return res.json({ 
      success: true, 
      message: 'Menu item image uploaded successfully',
      imageUrl: imagePath
    });

  } catch (error) {
    console.error('Menu item image upload error:', error);
    
    // Clean up uploaded file if something fails
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads/menu-items', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    return res.status(500).json({ error: 'Failed to upload menu item image' });
  }
});

// Serve uploaded images
router.get('/uploads/profiles/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../uploads/profiles', filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});

// Serve category images
router.get('/uploads/categories/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../uploads/categories', filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});

// Serve menu item images
router.get('/uploads/menu-items/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../uploads/menu-items', filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});

// Proxy endpoint for images to bypass CORS issues
router.get('/proxy-image/:imagePath', (req, res) => {
  const imagePath = req.params.imagePath;
  const fullPath = path.join(__dirname, '../../uploads', imagePath);
  
  console.log('Proxy request for image:', imagePath);
  console.log('Full path:', fullPath);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Content-Type', 'image/jpeg');
  
  // Check if file exists
  if (fs.existsSync(fullPath)) {
    console.log('Serving image:', fullPath);
    res.sendFile(fullPath);
  } else {
    console.log('Image not found:', fullPath);
    res.status(404).json({ error: 'Image not found', path: fullPath });
  }
});

// Alternative proxy endpoint with different pattern
router.get('/image-proxy/:folder/:filename', (req, res) => {
  const { folder, filename } = req.params;
  const fullPath = path.join(__dirname, '../../uploads', folder, filename);
  
  console.log('Alternative proxy request for image:', folder, filename);
  console.log('Full path:', fullPath);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Content-Type', 'image/jpeg');
  
  // Check if file exists
  if (fs.existsSync(fullPath)) {
    console.log('Serving image:', fullPath);
    res.sendFile(fullPath);
  } else {
    console.log('Image not found:', fullPath);
    res.status(404).json({ error: 'Image not found', path: fullPath });
  }
});

// Test endpoint to list available images
router.get('/test-images', (req, res) => {
  const uploadsDir = path.join(__dirname, '../../uploads');
  
  try {
    const files = fs.readdirSync(uploadsDir, { recursive: true });
    const imageFiles = files.filter(file => 
      typeof file === 'string' && 
      (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'))
    );
    
    res.json({
      uploadsDir,
      files: imageFiles,
      count: imageFiles.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read uploads directory', message: error.message });
  }
});

// Simple image proxy endpoint
router.get('/image/:folder/:filename', (req, res) => {
  const { folder, filename } = req.params;
  const imagePath = path.join(__dirname, '../../uploads', folder, filename);
  
  console.log('Serving image:', imagePath);
  
  // Set aggressive CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Expose-Headers', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Remove problematic headers
  res.removeHeader('X-Frame-Options');
  res.removeHeader('X-Content-Type-Options');
  res.removeHeader('X-DNS-Prefetch-Control');
  res.removeHeader('X-Download-Options');
  res.removeHeader('X-Permitted-Cross-Domain-Policies');
  res.removeHeader('X-XSS-Protection');
  res.removeHeader('Strict-Transport-Security');
  res.removeHeader('Referrer-Policy');
  res.removeHeader('Cross-Origin-Opener-Policy');
  
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ error: 'Image not found', path: imagePath });
  }
});

// Alternative image proxy endpoint with different path
router.get('/proxy/:folder/:filename', (req, res) => {
  const { folder, filename } = req.params;
  const imagePath = path.join(__dirname, '../../uploads', folder, filename);
  
  console.log('Serving image via proxy:', imagePath);
  
  // Set aggressive CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Expose-Headers', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Remove problematic headers
  res.removeHeader('X-Frame-Options');
  res.removeHeader('X-Content-Type-Options');
  res.removeHeader('X-DNS-Prefetch-Control');
  res.removeHeader('X-Download-Options');
  res.removeHeader('X-Permitted-Cross-Domain-Policies');
  res.removeHeader('X-XSS-Protection');
  res.removeHeader('Strict-Transport-Security');
  res.removeHeader('Referrer-Policy');
  res.removeHeader('Cross-Origin-Opener-Policy');
  
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ error: 'Image not found', path: imagePath });
  }
});

module.exports = router;
