const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const helmet = require('helmet');

dotenv.config();
const app = express();

// Performance middleware
app.use(compression()); // Enable gzip compression

// Completely disable helmet for development
// app.use(helmet());
// CORS headers for all requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma, Expires');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // Override any restrictive CORS policies
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

// Optimize JSON parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Custom image serving route to bypass Express static file CORS issues
app.get('/uploads/:folder/:filename', (req, res) => {
  const imagePath = path.join(__dirname, '../uploads', req.params.folder, req.params.filename);
  
  // Set aggressive CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.setHeader('Access-Control-Max-Age', '0');
  res.setHeader('Access-Control-Expose-Headers', '*');
  
  // CRITICAL: Override Cross-Origin-Resource-Policy to allow cross-origin requests
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  
  // Remove all problematic headers
  res.removeHeader('Clear-Site-Data');
  res.removeHeader('X-Frame-Options');
  res.removeHeader('X-Content-Type-Options');
  res.removeHeader('X-DNS-Prefetch-Control');
  res.removeHeader('X-Download-Options');
  res.removeHeader('X-Permitted-Cross-Domain-Policies');
  res.removeHeader('X-XSS-Protection');
  res.removeHeader('Strict-Transport-Security');
  res.removeHeader('Referrer-Policy');
  
  // Set no-cache headers
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Vary', '*');
  
  // Check if file exists
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});


// Test endpoint to verify CORS headers
app.get('/test-cors', (req, res) => {
  console.log('Test CORS route hit');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.json({ message: 'CORS test successful', timestamp: new Date().toISOString() });
});

// Simple test route
app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Test route working', timestamp: new Date().toISOString() });
});


// Handle OPTIONS requests for auth routes specifically
app.options('/api/auth/login', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Cache-Control, Pragma, Expires');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.status(200).end();
});

app.options('/api/auth/register', (req, res) => {
  console.log('OPTIONS request for auth route');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Cache-Control, Pragma, Expires');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.status(200).end();
});

// Additional CORS handler for all API routes
app.use('/api', (req, res, next) => {
  console.log('API route CORS handler:', req.method, req.url);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Cache-Control, Pragma, Expires');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  next();
});

// Routes will be loaded below after test endpoints

app.get('/api/health', (_req, res) => {
  console.log('Health endpoint called');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Cache-Control, Pragma, Expires');
  res.json({ ok: true, ts: new Date().toISOString() });
});

// Test CORS endpoint
app.get('/api/cors-test', (_req, res) => {
  console.log('CORS test endpoint called');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Cache-Control, Pragma, Expires');
  res.json({ cors: 'working', timestamp: new Date().toISOString() });
});

// Test deployment endpoint - LOCALHOST TO PRODUCTION TEST
app.get('/api/deployment-test', (_req, res) => {
  console.log('🚀 Deployment test endpoint called - LOCALHOST TO PRODUCTION WORKFLOW TEST');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Cache-Control, Pragma, Expires');
  res.json({ 
    message: '🎉 LOCALHOST TO PRODUCTION DEPLOYMENT TEST SUCCESSFUL!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'PostgreSQL (Render.com)',
    status: 'working'
  });
});

// Test image endpoint with explicit CORS headers
app.get('/api/test-image', (_req, res) => {
  console.log('🧪 Test image endpoint called');
  
  // Explicitly set all CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  
  // Return a simple test response
  res.json({ 
    message: 'Test image endpoint with CORS headers',
    timestamp: new Date().toISOString(),
    headers: {
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Cross-Origin-Opener-Policy': 'unsafe-none'
    }
  });
});
// Final middleware to override any restrictive headers
app.use((req, res, next) => {
  // Override any restrictive CORS headers that might have been set
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Expose-Headers', '*');
  res.setHeader('Access-Control-Max-Age', '0');
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
  res.removeHeader('Clear-Site-Data');
  
  next();
});

// Override headers after response is sent
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function(data) {
    // Override headers right before sending
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Expose-Headers', '*');
    res.setHeader('Access-Control-Max-Age', '0');
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
    res.removeHeader('Clear-Site-Data');
    
    return originalSend.call(this, data);
  };
  next();
});

// Load routes
console.log('Loading routes...');
app.use('/api/auth', require('./routes/auth'));
console.log('Auth routes loaded');
app.use('/api', require('./routes/upload'));
console.log('Upload routes loaded');
app.use('/api/orders', require('./routes/orders'));
console.log('Orders routes loaded');
app.use('/api/reservations', require('./routes/reservations'));
console.log('Reservations routes loaded');
// Load menu routes at /api/menu for new routes
app.use('/api/menu', require('./routes/menu'));
console.log('Menu routes loaded at /api/menu/*');
// ALSO load menu routes at /api for backward compatibility (frontend uses /api/menu-items, /api/categories)
app.use('/api', require('./routes/menu'));
console.log('Menu routes ALSO loaded at /api/* for backward compatibility');
app.use('/api/inventory', require('./routes/inventory'));
console.log('Inventory routes loaded');
app.use('/api/users', require('./routes/users'));
console.log('Users routes loaded');
app.use('/api/attendance', require('./routes/attendance'));
console.log('Attendance routes loaded');
app.use('/api/cache', require('./routes/cache-control'));
console.log('Cache control routes loaded');
console.log('All routes loaded successfully');

const port = Number(process.env.PORT||4000);
app.listen(port, async () => {
  console.log('API listening on http://localhost:'+port);
  
  // Pre-warm cache after server starts
  const { prewarmCache } = require('./cache-prewarmer');
  await prewarmCache();
});
