const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

dotenv.config();
const app = express();

// Performance middleware
app.use(compression()); // Enable gzip compression

// Completely disable helmet for development
// app.use(helmet());
// ULTIMATE CORS FIX - Set headers on EVERY request
app.use((req, res, next) => {
  console.log('Setting CORS headers for:', req.method, req.url);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // Override any restrictive CORS policies
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    res.status(200).end();
    return;
  }
  next();
});

// Optimize JSON parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory with cross-origin support
app.use('/uploads', (req, res, next) => {
  console.log('Setting upload headers for:', req.url);
  
  // Set permissive CORS headers for all upload requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  
  // Remove any restrictive headers that might be set elsewhere
  res.removeHeader('Cross-Origin-Resource-Policy');
  res.removeHeader('Cross-Origin-Embedder-Policy');
  res.removeHeader('Cross-Origin-Opener-Policy');
  
  // Set the correct headers
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

// Custom route for serving images with proper CORS headers
app.get('/uploads/*', (req, res) => {
  console.log('🖼️ Serving image:', req.url);
  const filePath = path.join(__dirname, '../uploads', req.params[0]);
  
  // Set permissive CORS headers BEFORE any other processing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  
  // Force remove any restrictive headers that might be set by Express
  res.removeHeader('Cross-Origin-Resource-Policy');
  res.removeHeader('Cross-Origin-Embedder-Policy');
  res.removeHeader('Cross-Origin-Opener-Policy');
  
  // Set the correct headers again
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  
  // Log headers being set
  console.log('📋 Headers being set:', {
    'Cross-Origin-Resource-Policy': res.getHeader('Cross-Origin-Resource-Policy'),
    'Cross-Origin-Embedder-Policy': res.getHeader('Cross-Origin-Embedder-Policy'),
    'Cross-Origin-Opener-Policy': res.getHeader('Cross-Origin-Opener-Policy'),
    'Access-Control-Allow-Origin': res.getHeader('Access-Control-Allow-Origin')
  });
  
  // Serve the file
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving file:', err);
      res.status(404).send('File not found');
    } else {
      console.log('✅ File served successfully:', filePath);
    }
  });
});

// Alternative image serving endpoint
app.get('/api/image/*', (req, res) => {
  console.log('🖼️ Alternative image endpoint:', req.url);
  const filePath = path.join(__dirname, '../uploads', req.params[0]);
  
  // Set permissive CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  
  // Serve the file
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving file:', err);
      res.status(404).send('File not found');
    } else {
      console.log('✅ File served successfully via alternative endpoint:', filePath);
    }
  });
});


// Handle OPTIONS requests for auth routes specifically
app.options('/api/auth/login', (req, res) => {
  console.log('OPTIONS request for auth route');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.status(200).end();
});

app.options('/api/auth/register', (req, res) => {
  console.log('OPTIONS request for auth route');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.status(200).end();
});

// Additional CORS handler for all API routes
app.use('/api', (req, res, next) => {
  console.log('API route CORS handler:', req.method, req.url);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  next();
});

// auth routes
app.use('/api/auth', require('./routes/auth'));
// upload routes
app.use('/api', require('./routes/upload'));
// orders routes
app.use('/api/orders', require('./routes/orders'));

// reservations routes
app.use('/api/reservations', require('./routes/reservations'));

// menu routes
app.use('/api', require('./routes/menu'));

// inventory routes
app.use('/api/inventory', require('./routes/inventory'));

// users routes
app.use('/api/users', require('./routes/users'));

app.get('/api/health', (_req, res) => {
  console.log('Health endpoint called');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.json({ ok: true, ts: new Date().toISOString() });
});

// Test CORS endpoint
app.get('/api/cors-test', (_req, res) => {
  console.log('CORS test endpoint called');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.json({ cors: 'working', timestamp: new Date().toISOString() });
});

// Test deployment endpoint - LOCALHOST TO PRODUCTION TEST
app.get('/api/deployment-test', (_req, res) => {
  console.log('🚀 Deployment test endpoint called - LOCALHOST TO PRODUCTION WORKFLOW TEST');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
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
  next();
});

const port = Number(process.env.PORT||4000);
app.listen(port, () => console.log('API listening on http://localhost:'+port));
