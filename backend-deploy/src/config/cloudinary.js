const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.warn('⚠️ Cloudinary credentials not configured. Image uploads will not work.');
  console.warn('⚠️ Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

// Create storage for different image types
const createCloudinaryStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `cosypos/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [
        { quality: 'auto', fetch_format: 'auto' } // Automatic optimization
      ]
    }
  });
};

// Storage configurations for different upload types
const profileStorage = createCloudinaryStorage('profiles');
const categoryStorage = createCloudinaryStorage('categories');
const menuItemStorage = createCloudinaryStorage('menu-items');

module.exports = {
  cloudinary,
  profileStorage,
  categoryStorage,
  menuItemStorage
};

