// Optimized API client with caching and performance improvements
class ApiClient {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.requestQueue = new Map();
  }

  getCacheKey(url, options = {}) {
    const { method = 'GET', headers = {}, body } = options;
    
    // Normalize headers - sort keys and convert to lowercase
    const normalizedHeaders = Object.keys(headers)
      .sort()
      .map(key => `${key.toLowerCase()}:${headers[key]}`)
      .join('|');
    
    // Create stable body representation
    let bodyMarker = '';
    if (body) {
      if (body instanceof FormData) {
        // For FormData, create a stable representation of all entries
        const entries = Array.from(body.entries())
          .map(([key, value]) => `${key}:${value instanceof File ? value.name + ':' + value.size : value}`)
          .sort()
          .join('|');
        bodyMarker = `FormData:${entries}`;
      } else if (body instanceof ArrayBuffer) {
        // Include a simple hash of the content
        const view = new Uint8Array(body);
        const hash = Array.from(view).reduce((acc, byte) => acc + byte, 0);
        bodyMarker = `ArrayBuffer:${body.byteLength}:${hash}`;
      } else if (typeof body === 'string') {
        bodyMarker = `String:${body}`;
      } else if (typeof body === 'object') {
        // For objects, create a stable string representation
        try {
          const sortedBody = JSON.stringify(body, Object.keys(body).sort());
          bodyMarker = `Object:${sortedBody}`;
        } catch {
          bodyMarker = 'Object:unserializable';
        }
      } else {
        bodyMarker = `Unknown:${typeof body}`;
      }
    }    
    return `${url}_${method}_${normalizedHeaders}_${bodyMarker}`;
  }

  isCacheValid(timestamp) {
    return Date.now() - timestamp < this.cacheTimeout;
  }

  async request(url, options = {}) {
    const cacheKey = this.getCacheKey(url, options);
    
    // Check cache first
    if (options.method === 'GET' && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (this.isCacheValid(cached.timestamp)) {
        return cached.data;
      }
      this.cache.delete(cacheKey);
    }

    // Prevent duplicate requests
    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey);
    }

    const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const token = localStorage.getItem('token');
    // Only set Content-Type for non-FormData requests
    const hasContentType = Object.keys(headers).some(
      key => key.toLowerCase() === 'content-type'
    );
    if (!(options.body instanceof FormData) && !hasContentType) {
      headers['Content-Type'] = 'application/json';
    }    
    // Only set Content-Type for non-FormData requests
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const requestPromise = fetch(base + url, {
      ...options,
      headers,
      // Add performance headers
      cache: options.method === 'GET' ? 'default' : 'no-cache'
    }).then(async (response) => {
      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const error = await response.json();
          errorMessage = error.error || error.message || errorMessage;
        } catch {
          // Not JSON, try to get text
          const text = await response.text().catch(() => '');
          if (text) errorMessage = text;
        }
        throw new Error(errorMessage);
      }
      return response.json();
    });

    // Cache GET requests
    if (options.method === 'GET') {
      this.requestQueue.set(cacheKey, requestPromise);
      
      requestPromise.then(data => {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        this.requestQueue.delete(cacheKey);
      }).catch(() => {
        this.requestQueue.delete(cacheKey);
      });
    }

    return requestPromise;
  }

  // Optimized GET with caching
  async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  // Optimized POST
  async post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Optimized PUT
  async put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Optimized DELETE
  async delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }

  // Clear cache for specific patterns
  clearCache(pattern = null) {
    if (pattern) {
      for (const [key] of this.cache) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  // Batch requests for better performance
  async batch(requests) {
    const promises = requests.map(({ url, options }) => 
      this.request(url, options)
    );
    return Promise.all(promises);
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Optimized API functions with caching
export const optimizedApi = {
  // Auth functions
  async getCurrentUser() {
    return apiClient.get('/api/auth/me');
  },

  async updateProfile(profileData) {
    const result = await apiClient.put('/api/auth/profile', profileData);
    apiClient.clearCache('/api/auth/me'); // Clear user cache after success
    return result;
  },

  // Menu functions with caching
  async getMenuItems() {
    return apiClient.get('/api/menu-items');
  },

  async updateMenuItem(id, data) {
    apiClient.clearCache('/api/menu-items'); // Clear menu cache
    return apiClient.put(`/api/menu-items/${id}`, data);
  },

  async createMenuItem(data) {
    apiClient.clearCache('/api/menu-items');
    return apiClient.post('/api/menu-items', data);
  },

  async deleteMenuItem(id) {
    apiClient.clearCache('/api/menu-items');
    return apiClient.delete(`/api/menu-items/${id}`);
  },

  // Category functions
  async getCategories() {
    return apiClient.get('/api/categories');
  },

  async createCategory(data) {
    apiClient.clearCache('/api/categories');
    return apiClient.post('/api/categories', data);
  },

  async updateCategory(id, data) {
    apiClient.clearCache('/api/categories');
    return apiClient.put(`/api/categories/${id}`, data);
  },

  async deleteCategory(id) {
    apiClient.clearCache('/api/categories');
    return apiClient.delete(`/api/categories/${id}`);
  },

  // Order functions
  async getOrders() {
    return apiClient.get('/api/orders');
  },

  async createOrder(data) {
    apiClient.clearCache('/api/orders');
    return apiClient.post('/api/orders', data);
  },

  async updateOrder(id, data) {
    apiClient.clearCache('/api/orders');
    return apiClient.put(`/api/orders/${id}`, data);
  },

  async deleteOrder(id) {
    apiClient.clearCache('/api/orders');
    return apiClient.delete(`/api/orders/${id}`);
  },

  // Reservation functions
  async getReservations() {
    return apiClient.get('/api/reservations');
  },

  async getReservationsByDateFloor(date, floor) {
    const params = new URLSearchParams({ date, floor });
    return apiClient.get(`/api/reservations/by-date-floor?${params}`);
  },

  async createReservation(data) {
    apiClient.clearCache('/api/reservations');
    return apiClient.post('/api/reservations', data);
  },

  async updateReservation(id, data) {
    apiClient.clearCache('/api/reservations');
    return apiClient.put(`/api/reservations/${id}`, data);
  },

  async deleteReservation(id) {
    apiClient.clearCache('/api/reservations');
    return apiClient.delete(`/api/reservations/${id}`);
  },

  async getAvailableTables(date, startTime, endTime, floor) {
    const params = new URLSearchParams({ date, startTime, endTime, floor });
    return apiClient.get(`/api/reservations/available-tables?${params}`);
  },

  // Inventory functions
  async getInventoryItems() {
    return apiClient.get('/api/inventory');
  },

  async updateInventoryStock(id, stock) {
    apiClient.clearCache('/api/inventory');
    return apiClient.put(`/api/inventory/${id}/stock`, { stock });
  },

  async updateInventoryAvailability(id, availability) {
    apiClient.clearCache('/api/inventory');
    return apiClient.put(`/api/inventory/${id}/availability`, { availability });
  },

  async bulkUpdateInventory(updates) {
    apiClient.clearCache('/api/inventory');
    return apiClient.put('/api/inventory/bulk-update', { updates });
  },

  async getLowStockItems(threshold = 10) {
    const params = new URLSearchParams({ threshold: threshold.toString() });
    return apiClient.get(`/api/inventory/alerts/low-stock?${params}`);
  },

  async getOutOfStockItems() {
    return apiClient.get('/api/inventory/alerts/out-of-stock');
  },

  // Image upload functions
  async uploadProfileImage(imageFile) {
    const formData = new FormData();
    formData.append('profileImage', imageFile);
    
    return apiClient.request('/api/profile-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
  },

  async uploadCategoryImage(imageFile) {
    const formData = new FormData();
    formData.append('categoryImage', imageFile);
    
    return apiClient.request('/api/category-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
  },

  async uploadMenuItemImage(imageFile) {
    const formData = new FormData();
    formData.append('menuItemImage', imageFile);
    
    return apiClient.request('/api/menu-item-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
  },

  // Utility functions
  clearCache: (pattern) => apiClient.clearCache(pattern),
  batch: (requests) => apiClient.batch(requests)
};

export default optimizedApi;
