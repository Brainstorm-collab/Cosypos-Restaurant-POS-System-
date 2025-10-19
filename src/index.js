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
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').filter(Boolean) : ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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
