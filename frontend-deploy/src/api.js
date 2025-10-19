export async function login(email, password) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const r = await fetch(base + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!r.ok) throw new Error('login failed');
  return r.json();
}

export async function getCurrentUser() {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  
  const r = await fetch(base + '/api/auth/me', {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  if (!r.ok) throw new Error('Failed to get user info');
  return r.json();
}

export async function updateProfile(profileData) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  
  const r = await fetch(base + '/api/auth/profile', {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(profileData),
  });
  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to update profile');
  }
  return r.json();
}

export async function uploadProfileImage(imageFile) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  
  const formData = new FormData();
  formData.append('profileImage', imageFile);
  
  const r = await fetch(base + '/api/profile-image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData,
  });
  
  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to upload image');
  }
  return r.json();
}

// Order API functions
export async function getOrders() {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const r = await fetch(base + '/api/orders', {
    method: 'GET',
    headers
  });
  
  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to fetch orders');
  }
  return r.json();
}

export async function createOrder(orderData) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const r = await fetch(base + '/api/orders', {
    method: 'POST',
    headers,
    body: JSON.stringify(orderData)
  });
  
  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to create order');
  }
  return r.json();
}

export async function updateOrder(orderId, orderData) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const r = await fetch(base + '/api/orders/' + orderId, {
    method: 'PUT',
    headers,
    body: JSON.stringify(orderData)
  });
  
  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to update order');
  }
  return r.json();
}

export async function deleteOrder(orderId) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const r = await fetch(base + '/api/orders/' + orderId, {
    method: 'DELETE',
    headers
  });
  
  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to delete order');
  }
  return r.json();
}

export async function getMenuItems() {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const r = await fetch(base + '/api/menu-items', {
    method: 'GET',
    headers
  });

  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to fetch menu items');
  }
  return r.json();
}

export async function updateMenuItem(menuItemId, menuItemData) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const r = await fetch(base + '/api/menu-items/' + menuItemId, {
    method: 'PUT',
    headers,
    body: JSON.stringify(menuItemData)
  });
  
  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to update menu item');
  }
  return r.json();
}

export async function createMenuItem(menuItemData) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const r = await fetch(base + '/api/menu-items', {
    method: 'POST',
    headers,
    body: JSON.stringify(menuItemData)
  });
  
  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to create menu item');
  }
  return r.json();
}

export async function deleteMenuItem(menuItemId) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const r = await fetch(base + '/api/menu-items/' + menuItemId, {
    method: 'DELETE',
    headers
  });
  
  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to delete menu item');
  }
  return r.json();
}

// Category API functions
export async function getCategories() {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const r = await fetch(base + '/api/categories', {
    method: 'GET',
    headers
  });
  
  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to fetch categories');
  }
  return r.json();
}

export async function createCategory(categoryData) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const r = await fetch(base + '/api/categories', {
    method: 'POST',
    headers,
    body: JSON.stringify(categoryData)
  });
  
  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to create category');
  }
  return r.json();
}

export async function updateCategory(categoryId, categoryData) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const r = await fetch(base + '/api/categories/' + categoryId, {
    method: 'PUT',
    headers,
    body: JSON.stringify(categoryData)
  });
  
  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to update category');
  }
  return r.json();
}

export async function deleteCategory(categoryId) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const r = await fetch(base + '/api/categories/' + categoryId, {
    method: 'DELETE',
    headers
  });
  
  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to delete category');
  }
  return r.json();
}

// Image upload functions
export async function uploadCategoryImage(imageFile) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  
  const formData = new FormData();
  formData.append('categoryImage', imageFile);
  
  const r = await fetch(base + '/api/category-image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData,
  });
  
  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to upload category image');
  }
  return r.json();
}

export async function uploadMenuItemImage(imageFile) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  
  const formData = new FormData();
  formData.append('menuItemImage', imageFile);
  
  const r = await fetch(base + '/api/menu-item-image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData,
  });
  
  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to upload menu item image');
  }
  return r.json();
}

// Reservation API functions
export async function getReservations() {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const r = await fetch(base + '/api/reservations', {
    method: 'GET',
    headers
  });

  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to fetch reservations');
  }
  return r.json();
}

export async function getReservationsByDateFloor(date, floor) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const r = await fetch(base + `/api/reservations/by-date-floor?date=${date}&floor=${floor}`, {
    method: 'GET',
    headers
  });

  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to fetch reservations');
  }
  return r.json();
}

export async function createReservation(reservationData) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const r = await fetch(base + '/api/reservations', {
    method: 'POST',
    headers,
    body: JSON.stringify(reservationData)
  });

  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to create reservation');
  }
  return r.json();
}

export async function updateReservation(id, reservationData) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const r = await fetch(base + `/api/reservations/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(reservationData)
  });

  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to update reservation');
  }
  return r.json();
}

export async function deleteReservation(id) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const r = await fetch(base + `/api/reservations/${id}`, {
    method: 'DELETE',
    headers
  });

  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to delete reservation');
  }
  return r.json();
}

export async function getAvailableTables(date, startTime, endTime, floor) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const r = await fetch(base + `/api/reservations/available-tables?date=${date}&startTime=${startTime}&endTime=${endTime}&floor=${floor}`, {
    method: 'GET',
    headers
  });

  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to fetch available tables');
  }
  return r.json();
}

// Inventory API functions
export async function getInventoryItems() {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const r = await fetch(base + '/api/inventory', {
    method: 'GET',
    headers
  });
  
  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to fetch inventory items');
  }
  return r.json();
}

export async function updateInventoryStock(itemId, stock) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const r = await fetch(base + `/api/inventory/${itemId}/stock`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ stock })
  });
  
  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to update inventory stock');
  }
  return r.json();
}

export async function updateInventoryAvailability(itemId, availability) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const r = await fetch(base + `/api/inventory/${itemId}/availability`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ availability })
  });
  
  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to update inventory availability');
  }
  return r.json();
}

export async function bulkUpdateInventory(updates) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const r = await fetch(base + '/api/inventory/bulk-update', {
    method: 'PUT',
    headers,
    body: JSON.stringify({ updates })
  });
  
  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to bulk update inventory');
  }
  return r.json();
}

export async function getLowStockItems(threshold = 10) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const r = await fetch(base + `/api/inventory/alerts/low-stock?threshold=${threshold}`, {
    method: 'GET',
    headers
  });
  
  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to fetch low stock items');
  }
  return r.json();
}

export async function getOutOfStockItems() {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const r = await fetch(base + '/api/inventory/alerts/out-of-stock', {
    method: 'GET',
    headers
  });
  
  if (!r.ok) {
    const error = await r.json();
    throw new Error(error.error || 'Failed to fetch out of stock items');
  }
  return r.json();
}
