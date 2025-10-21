/**
 * Simple in-memory cache to reduce database queries
 * This will dramatically improve performance for frequently accessed data
 */

class SimpleCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 300000; // 5 minutes default TTL (increased for performance)
    this.hits = 0;
    this.misses = 0;
    
    // Auto-cleanup every 60 seconds to prevent memory bloat
    setInterval(() => this.cleanup(), 60000);
  }

  set(key, value, ttl = this.ttl) {
    const expires = Date.now() + ttl;
    this.cache.set(key, { value, expires, size: JSON.stringify(value).length });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) {
      this.misses++;
      return null;
    }
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }
    
    this.hits++;
    return item.value;
  }
  
  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    let cleaned = 0;
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    if (cleaned > 0) {
      console.log(`🧹 Cache cleanup: removed ${cleaned} expired entries`);
    }
  }
  
  // Get cache statistics
  stats() {
    const totalSize = Array.from(this.cache.values())
      .reduce((sum, item) => sum + (item.size || 0), 0);
    return {
      entries: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: this.hits > 0 ? ((this.hits / (this.hits + this.misses)) * 100).toFixed(1) + '%' : '0%',
      totalSize: `${(totalSize / 1024).toFixed(2)} KB`
    };
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  // Clear all keys matching a pattern
  clearPattern(pattern) {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

const cache = new SimpleCache();

module.exports = cache;

