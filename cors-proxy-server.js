const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Manual CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'false');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

// Proxy all API requests to the backend
app.use('/api', createProxyMiddleware({
  target: 'https://cosyposy-duplicate.onrender.com',
  changeOrigin: true,
  secure: true,
  logLevel: 'debug'
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'CORS Proxy Server Running',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`CORS Proxy Server running on port ${PORT}`);
});
