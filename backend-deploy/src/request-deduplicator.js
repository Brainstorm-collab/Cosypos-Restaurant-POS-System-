/**
 * Request Deduplicator
 * Prevents multiple simultaneous requests for the same data
 * This solves the "stampeding herd" problem where many requests
 * hit the database at the same time
 */

class RequestDeduplicator {
  constructor() {
    this.pending = new Map();
  }
  
  async deduplicate(key, fn) {
    // Check if this request is already in progress
    if (this.pending.has(key)) {
      console.log(`🔗 Deduplicating request: ${key} (waiting for in-flight request)`);
      return await this.pending.get(key);
    }
    
    // Start new request and store promise
    const promise = fn().finally(() => {
      // Clean up after request completes
      this.pending.delete(key);
    });
    
    this.pending.set(key, promise);
    return await promise;
  }
}

const deduplicator = new RequestDeduplicator();

module.exports = deduplicator;

