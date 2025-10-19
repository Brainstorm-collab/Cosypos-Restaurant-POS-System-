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
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'development' ? false : undefined,
  crossOriginEmbedderPolicy: process.env.NODE_ENV === 'development' ? false : undefined
}));
// ULTIMATE CORS FIX - Set headers on EVERY request
app.use((req, res, next) => {
  console.log('Setting CORS headers for:', req.method, req.url);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.setHeader('Access-Control-Max-Age', '86400');
  
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

// Serve static files from uploads directory with caching
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  maxAge: '1d', // Cache images for 1 day
  etag: true,
  lastModified: true
}));


// Handle OPTIONS requests for auth routes specifically
app.options('/api/auth/login', (req, res) => {
  console.log('OPTIONS request for auth login');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.status(200).end();
});

app.options('/api/auth/register', (req, res) => {
  console.log('OPTIONS request for auth register');
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

// Create admin user manually
app.post('/api/create-admin', async (_req, res) => {
  try {
    const { prisma } = require('./lib/prisma');
    const bcrypt = require('bcrypt');
    
    const adminPassword = await bcrypt.hash('pass123', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@cosypos.app' },
      update: {},
      create: {
        email: 'admin@cosypos.app',
        passwordHash: adminPassword,
        name: 'Admin User',
        role: 'ADMIN',
        phone: '+1234567890'
      }
    });
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.json({ 
      success: true, 
      message: 'Admin user created successfully',
      user: { email: admin.email, role: admin.role, name: admin.name }
    });
  } catch (error) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to create admin user'
    });
  }
});

// Create staff user manually
app.post('/api/create-staff', async (_req, res) => {
  try {
    const { prisma } = require('./lib/prisma');
    const bcrypt = require('bcrypt');
    
    const staffPassword = await bcrypt.hash('staff123', 10);
    const staff = await prisma.user.upsert({
      where: { email: 'staff@cosypos.app' },
      update: {},
      create: {
        email: 'staff@cosypos.app',
        passwordHash: staffPassword,
        name: 'Staff User',
        role: 'STAFF',
        phone: '+1234567891'
      }
    });
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.json({ 
      success: true, 
      message: 'Staff user created successfully',
      user: { email: staff.email, role: staff.role, name: staff.name }
    });
  } catch (error) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to create staff user'
    });
  }
});

// Create customer user manually
app.post('/api/create-customer', async (_req, res) => {
  try {
    const { prisma } = require('./lib/prisma');
    const bcrypt = require('bcrypt');
    
    const customerPassword = await bcrypt.hash('customer123', 10);
    const customer = await prisma.user.upsert({
      where: { email: 'customer@cosypos.app' },
      update: {},
      create: {
        email: 'customer@cosypos.app',
        passwordHash: customerPassword,
        name: 'Customer User',
        role: 'USER',
        phone: '+1234567892'
      }
    });
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.json({ 
      success: true, 
      message: 'Customer user created successfully',
      user: { email: customer.email, role: customer.role, name: customer.name }
    });
  } catch (error) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to create customer user'
    });
  }
});

// Test CORS endpoint
app.get('/api/cors-test', (_req, res) => {
  console.log('CORS test endpoint called');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.json({ cors: 'working', timestamp: new Date().toISOString() });
});
const port = Number(process.env.PORT||4000);
app.listen(port, () => console.log('API listening on http://localhost:'+port));
