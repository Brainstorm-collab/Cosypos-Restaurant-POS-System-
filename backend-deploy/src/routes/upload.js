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

// Upload profile image endpoint
router.post('/profile-image', requireAnyAuth(), upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const userId = req.user.id;
    const imagePath = `/uploads/profiles/${req.file.filename}`;

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

module.exports = router;
