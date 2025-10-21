/**
 * ETag middleware for HTTP 304 caching
 * Returns HTTP 304 Not Modified for unchanged data
 * This makes browser cache INSTANT (0ms response time)
 */

const crypto = require('crypto');

function etagMiddleware(req, res, next) {
  const originalJson = res.json;
  
  res.json = function(data) {
    // Generate ETag from data
    const etag = crypto
      .createHash('md5')
      .update(JSON.stringify(data))
      .digest('hex');
    
    // Set ETag header
    res.setHeader('ETag', `"${etag}"`);
    
    // Check if client has same version
    const clientEtag = req.headers['if-none-match'];
    if (clientEtag === `"${etag}"`) {
      // Data hasn't changed - return 304
      console.log(`⚡ HTTP 304 - Not Modified (instant response)`);
      return res.status(304).end();
    }
    
    // Data changed - return full response
    return originalJson.call(this, data);
  };
  
  next();
}

module.exports = etagMiddleware;

