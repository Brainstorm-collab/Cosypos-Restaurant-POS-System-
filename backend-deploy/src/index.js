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
// AGGRESSIVE CORS FIX - Allow everything
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
  res.header('Access-Control-Allow-Credentials', 'false');
  res.header('Access-Control-Max-Age', '86400');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

// Also use cors middleware as backup
app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cache-Control', 'Pragma']
}));

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
app.options('/api/auth/*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.status(200).end();
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

app.get('/api/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));
const port = Number(process.env.PORT||4000);
app.listen(port, () => console.log('API listening on http://localhost:'+port));
