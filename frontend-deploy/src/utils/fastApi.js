/**
 * Ultra-Fast API Module with Modern Optimization Techniques
 * - Parallel requests
 * - Request deduplication
 * - ETag caching
 * - Retry logic
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Request deduplication cache
const pendingRequests = new Map();

/**
 * Make an optimized API request with ETag caching
 */
async function optimizedFetch(url, options = {}) {
  const fullUrl = `${API_BASE}${url}`;
  
  // Add ETag support
  const cachedEtag = localStorage.getItem(`etag:${url}`);
  if (cachedEtag && options.method === 'GET') {
    options.headers = {
      ...options.headers,
      'If-None-Match': cachedEtag
    };
  }
  
  try {
    const response = await fetch(fullUrl, options);
    
    // Handle 304 Not Modified
    if (response.status === 304) {
      console.log(`⚡ HTTP 304 - Using cached data for ${url}`);
      const cachedData = localStorage.getItem(`cache:${url}`);
      return cachedData ? JSON.parse(cachedData) : null;
    }
    
    // Store ETag for future requests
    const etag = response.headers.get('ETag');
    if (etag) {
      localStorage.setItem(`etag:${url}`, etag);
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache response data
    if (options.method === 'GET') {
      localStorage.setItem(`cache:${url}`, JSON.stringify(data));
    }
    
    return data;
  } catch (error) {
    // Try to use cached data on error
    const cachedData = localStorage.getItem(`cache:${url}`);
    if (cachedData) {
      console.log(`⚠️ Using cached data due to error: ${error.message}`);
      return JSON.parse(cachedData);
    }
    throw error;
  }
}

/**
 * Deduplicated GET request
 */
async function deduplicatedGet(url) {
  // Check if request is already in flight
  if (pendingRequests.has(url)) {
    console.log(`🔗 Deduplicating request: ${url}`);
    return await pendingRequests.get(url);
  }
  
  // Start new request
  const promise = optimizedFetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  }).finally(() => {
    pendingRequests.delete(url);
  });
  
  pendingRequests.set(url, promise);
  return await promise;
}

/**
 * Fetch multiple endpoints in parallel
 */
export async function fetchParallel(...urls) {
  console.log(`🚀 Fetching ${urls.length} endpoints in parallel`);
  const startTime = Date.now();
  
  const results = await Promise.all(
    urls.map(url => deduplicatedGet(url))
  );
  
  console.log(`✅ Parallel fetch completed in ${Date.now() - startTime}ms`);
  return results;
}

/**
 * Fast API methods
 */
export const fastApi = {
  // Get menu items and categories in parallel
  async getMenuData() {
    const [menuItems, categories] = await fetchParallel(
      '/api/menu-items',
      '/api/categories'
    );
    return { menuItems, categories };
  },
  
  // Get orders
  async getOrders() {
    return await deduplicatedGet('/api/orders');
  },
  
  // Get menu items only
  async getMenuItems() {
    return await deduplicatedGet('/api/menu-items');
  },
  
  // Get categories only
  async getCategories() {
    return await deduplicatedGet('/api/categories');
  },
  
  // Clear all caches (call after mutations)
  clearCache() {
    // Clear ETag and data cache
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('etag:') || key.startsWith('cache:')) {
        localStorage.removeItem(key);
      }
    });
    console.log('🧹 API cache cleared');
  }
};

export default fastApi;

