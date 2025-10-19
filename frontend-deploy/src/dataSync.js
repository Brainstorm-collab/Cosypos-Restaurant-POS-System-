// Centralized data synchronization system for real-time updates across all pages

class DataSync {
  constructor() {
    this.listeners = new Map();
    this.data = {
      menuItems: [],
      categories: [],
      orders: [],
      inventory: []
    };
  }

  // Subscribe to data changes
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(key);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  // Update data and notify all listeners
  updateData(key, newData) {
    this.data[key] = newData;
    const callbacks = this.listeners.get(key);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(newData);
        } catch (error) {
          console.error('Error in data sync callback:', error);
        }
      });
    }
  }

  // Get current data
  getData(key) {
    return this.data[key] || [];
  }

  // Update specific item in menu items
  updateMenuItem(itemId, updatedItem) {
    const menuItems = [...this.data.menuItems];
    const index = menuItems.findIndex(item => item.id === itemId || item.apiId === itemId);
    
    if (index !== -1) {
      menuItems[index] = { ...menuItems[index], ...updatedItem };
      this.updateData('menuItems', menuItems);
    }
  }

  // Add new menu item
  addMenuItem(newItem) {
    const menuItems = [...this.data.menuItems, newItem];
    this.updateData('menuItems', menuItems);
  }

  // Remove menu item
  removeMenuItem(itemId) {
    const menuItems = this.data.menuItems.filter(item => item.id !== itemId && item.apiId !== itemId);
    this.updateData('menuItems', menuItems);
  }

  // Update category data
  updateCategories(categories) {
    this.updateData('categories', categories);
  }

  // Standardize menu item format
  standardizeMenuItem(item) {
    return {
      id: item.id || `#${item.apiId || Date.now()}`,
      apiId: item.apiId || item.id,
      name: item.name || '',
      description: item.description || '',
      image: this.getStandardizedImage(item),
      stock: parseInt(item.stock) || 0,
      category: typeof item.category === 'string' ? item.category : item.category?.name || 'Other',
      price: this.getStandardizedPrice(item),
      availability: item.availability || 'In Stock',
      active: item.active !== false
    };
  }

  // Get standardized image based on item name
  getStandardizedImage(item) {
    const imageMap = {
      // Pizza items
      'Margherita Pizza': '/pizza.jpg',
      'Pepperoni Pizza': '/pizza.jpg',
      'BBQ Chicken Pizza': '/pizza.jpg',
      'Veggie Supreme Pizza': '/pizza.jpg',
      
      // Burger items
      'Classic Burger': '/burger.jpg',
      'Chicken Burger': '/burger.jpg',
      'Cheeseburger': '/burger.jpg',
      'Bacon Burger': '/burger.jpg',
      
      // Chicken items
      'Chicken Parmesan': '/chicken-parmesan.png',
      'Grilled Chicken': '/grill chicken.jpg',
      
      // Beverage items
      'Coca Cola': '/cococola.jpg',
      'Fresh Orange Juice': '/orange juice.jpg',
      
      // Seafood items
      'Grilled Salmon': '/salamon.jpg',
      
      // Bakery items
      'Chocolate Cake': '/choclate cake.jpg',
      'Apple Pie': '/apple pie.jpg'
    };

    // Check for locally stored image first
    if (item.apiId) {
      const imageKey = `menu_item_image_${item.apiId}`;
      const localImage = localStorage.getItem(imageKey);
      if (localImage) return localImage;
    }

    // Use specific image based on name
    const specificImage = imageMap[item.name];
    if (specificImage) return specificImage;

    // Use existing image if valid
    if (item.image && (item.image.startsWith('/') || item.image.startsWith('http'))) {
      return item.image;
    }

    // Default fallback
    return '/placeholder-food.jpg';
  }

  // Get standardized price format
  getStandardizedPrice(item) {
    if (item.price) {
      // If price is already formatted (e.g., "$25.00")
      if (typeof item.price === 'string' && item.price.startsWith('$')) {
        return item.price;
      }
      // If price is in cents
      if (item.priceCents) {
        return `$${(item.priceCents / 100).toFixed(2)}`;
      }
      // If price is a number
      if (typeof item.price === 'number') {
        return `$${item.price.toFixed(2)}`;
      }
    }
    return '$0.00';
  }

  // Calculate category counts
  calculateCategoryCounts(categories, menuItems) {
    return categories.map(category => {
      if (category.id === 'all') {
        return {
          ...category,
          count: menuItems.length
        };
      } else {
        const count = menuItems.filter(item => {
          const itemCategory = typeof item.category === 'string' ? item.category : item.category?.name;
          return itemCategory?.toLowerCase() === category.name.toLowerCase();
        }).length;
        return {
          ...category,
          count: count
        };
      }
    });
  }

  // Broadcast update to all components
  broadcastUpdate(type, data) {
    // Update internal data
    this.updateData(type, data);
    
    // Also update localStorage for persistence
    localStorage.setItem(`cosypos_${type}`, JSON.stringify(data));
    
    // Trigger custom event for cross-component communication
    window.dispatchEvent(new CustomEvent('cosypos-data-update', {
      detail: { type, data }
    }));
  }
}

// Create singleton instance
const dataSync = new DataSync();

export default dataSync;
