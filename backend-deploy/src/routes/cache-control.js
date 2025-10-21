const express = require('express');
const router = express.Router();
const cache = require('../cache');
const { requireAnyAuth } = require('../middleware/auth');

// Clear all cache (admin only)
router.post('/clear-all', requireAnyAuth(), (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  cache.clear();
  console.log('🧹 All cache cleared by admin:', req.user.email);
  res.json({ message: 'All cache cleared successfully' });
});

// Clear specific cache pattern (admin only)
router.post('/clear-pattern', requireAnyAuth(), (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  const { pattern } = req.body;
  if (!pattern) {
    return res.status(400).json({ error: 'Pattern is required' });
  }
  
  cache.clearPattern(pattern);
  console.log('🧹 Cache pattern cleared:', pattern, 'by:', req.user.email);
  res.json({ message: `Cache pattern '${pattern}' cleared successfully` });
});

// Get cache stats (admin only)
router.get('/stats', requireAnyAuth(), (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  const stats = cache.stats();
  const keys = Array.from(cache.cache.keys());
  
  res.json({
    ...stats,
    keys: keys,
    ttl: `${cache.ttl / 1000}s`
  });
});

module.exports = router;

