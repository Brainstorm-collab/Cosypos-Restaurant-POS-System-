const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { prisma } = require('../lib/prisma');
const { requireAnyAuth } = require('../middleware/auth');

const router = express.Router();

// MIME type mapping for supported image formats
const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

// Secure helper function to serve images with path validation
function serveSecureImage(req, res, filePath) {
  const uploadsDir = path.join(__dirname, '../../uploads');
  
  // Resolve and normalize the path to prevent directory traversal
  const resolvedPath = path.resolve(uploadsDir, filePath);
  
  // Security check: ensure resolved path is within uploads directory
  if (!resolvedPath.startsWith(uploadsDir)) {
    console.error('⚠️ Security: Path traversal attempt blocked:', filePath);
    return res.status(403).json({ error: 'Access denied: Invalid path' });
  }
  
  // Validate file exists
  if (!fs.existsSync(resolvedPath)) {
    console.log('Image not found:', resolvedPath);
    return res.status(404).json({ error: 'Image not found' });
  }
  
  // Determine MIME type from file extension
  const ext = path.extname(resolvedPath).toLowerCase();
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
  
  // Set secure CORS headers (specific origin in production)
  res.setHeader('Access-Control-Allow-Origin', '*'); // TODO: Use specific origin in production
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Content-Type', mimeType);
  
  // Enable caching for static images (1 hour)
  res.setHeader('Cache-Control', 'public, max-age=3600');
  
  // Serve the file
  console.log('Serving secure image:', resolvedPath);
  res.sendFile(resolvedPath);
}

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

// Secure proxy endpoint for images
router.get('/proxy-image/:imagePath', requireAnyAuth(), (req, res) => {
  const imagePath = req.params.imagePath;
  // Validate input - reject paths with .. or other suspicious patterns
  if (imagePath.includes('..') || imagePath.includes('~') || /[<>:"|?*]/.test(imagePath)) {
    return res.status(400).json({ error: 'Invalid image path' });
  }
  serveSecureImage(req, res, imagePath);
});

// Secure proxy endpoint with folder/filename pattern
router.get('/image-proxy/:folder/:filename', requireAnyAuth(), (req, res) => {
  const { folder, filename } = req.params;
  // Validate inputs - reject suspicious patterns
  if (folder.includes('..') || filename.includes('..') || 
      /[<>:"|?*]/.test(folder) || /[<>:"|?*]/.test(filename)) {
    return res.status(400).json({ error: 'Invalid path parameters' });
  }
  serveSecureImage(req, res, path.join(folder, filename));
});

// Secure test endpoint to list available images (admin only, for debugging)
router.get('/test-images', requireAnyAuth(), async (req, res) => {
  // Only allow admins to access this debugging endpoint
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  const uploadsDir = path.join(__dirname, '../../uploads');
  
  try {
    // Use async readdir instead of blocking readdirSync
    const fs_promises = require('fs').promises;
    const files = await fs_promises.readdir(uploadsDir, { recursive: true });
    const imageFiles = files.filter(file => 
      typeof file === 'string' && 
      (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || 
       file.endsWith('.gif') || file.endsWith('.webp'))
    );
    
    // Return count and limited info, not full paths
    res.json({
      count: imageFiles.length,
      categories: {
        profiles: imageFiles.filter(f => f.startsWith('profiles')).length,
        categories: imageFiles.filter(f => f.startsWith('categories')).length,
        menuItems: imageFiles.filter(f => f.startsWith('menu-items')).length
      }
    });
  } catch (error) {
    console.error('Error reading uploads directory:', error);
    res.status(500).json({ error: 'Failed to read uploads directory' });
  }
});

// Secure image serving endpoint
router.get('/image/:folder/:filename', requireAnyAuth(), (req, res) => {
  const { folder, filename } = req.params;
  // Validate inputs - reject suspicious patterns
  if (folder.includes('..') || filename.includes('..') || 
      /[<>:"|?*]/.test(folder) || /[<>:"|?*]/.test(filename)) {
    return res.status(400).json({ error: 'Invalid path parameters' });
  }
  serveSecureImage(req, res, path.join(folder, filename));
});

// Secure proxy endpoint with different path pattern
router.get('/proxy/:folder/:filename', requireAnyAuth(), (req, res) => {
  const { folder, filename } = req.params;
  // Validate inputs - reject suspicious patterns
  if (folder.includes('..') || filename.includes('..') || 
      /[<>:"|?*]/.test(folder) || /[<>:"|?*]/.test(filename)) {
    return res.status(400).json({ error: 'Invalid path parameters' });
  }
  serveSecureImage(req, res, path.join(folder, filename));
});

module.exports = router;


