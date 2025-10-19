# CosyPOS Staff Role Documentation

## Table of Contents
1. [Overview](#overview)
2. [Staff Access & Permissions](#staff-access--permissions)
3. [Available Features](#available-features)
4. [Technical Implementation](#technical-implementation)
5. [User Interface Components](#user-interface-components)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Setup Instructions](#setup-instructions)
9. [Troubleshooting](#troubleshooting)
10. [Future Enhancements](#future-enhancements)

---

## Overview

The CosyPOS Staff Role provides operational management capabilities for restaurant staff members. This role is designed for employees who need to manage day-to-day restaurant operations, handle orders, manage inventory, and assist customers.

### Staff Role Characteristics
- **Role Type**: `STAFF` in the database
- **Access Level**: Operational features with limited administrative access
- **Target Users**: Restaurant staff, servers, kitchen staff, managers
- **Primary Functions**: Order management, inventory control, customer service, staff coordination

---

## Staff Access & Permissions

### ✅ **Allowed Features**
| Feature | Access Level | Description |
|---------|-------------|-------------|
| **Dashboard** | Full Access | View restaurant operations, recent activity, key metrics |
| **Menu Management** | Full Access | View, edit, and manage menu items and categories |
| **Order Management** | Full Access | Create, update, and manage all orders and payments |
| **Inventory Control** | Full Access | Quick edit stock levels, mark items out of stock |
| **Staff Management** | Full Access | View staff information, attendance, schedules |
| **Reservations** | Full Access | Manage table reservations and customer bookings |
| **Profile Management** | Full Access | Update personal information and profile image |
| **Notifications** | Full Access | Receive operational updates and alerts |

### ❌ **Restricted Features**
| Feature | Access Level | Reason |
|---------|-------------|---------|
| **Reports & Analytics** | No Access | Admin-only function |
| **User Management** | No Access | Administrative function |
| **System Settings** | No Access | Administrative function |
| **Financial Reports** | No Access | Management function |

---

## Available Features

### 1. Dashboard
**Purpose**: Restaurant operations overview and staff activity summary

**Features**:
- Real-time order status monitoring
- Popular dishes and recent orders
- Staff performance metrics
- Quick access to common tasks
- Inventory alerts and notifications

**Implementation**:
```javascript
// Dashboard component with staff-specific data
const Dashboard = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  
  // Staff sees operational data
  useEffect(() => {
    fetchRecentOrders();
    fetchInventoryAlerts();
  }, []);
  
  return (
    <div className="staff-dashboard">
      {/* Order status overview */}
      {/* Inventory alerts */}
      {/* Quick action buttons */}
    </div>
  );
};
```

### 2. Menu Management
**Purpose**: Manage restaurant menu items and categories

**Staff-Specific Features**:
- **Menu Item Editing**: Update prices, descriptions, availability
- **Category Management**: Add, edit, and organize menu categories
- **Image Management**: Upload and update food images
- **Availability Control**: Mark items as available/unavailable
- **Quick Updates**: Fast editing for price changes and descriptions

**Menu Categories Management**:
- 🍕 Pizza Management
- 🍝 Pasta & Noodles
- 🥗 Salads & Appetizers
- 🍖 Main Courses
- 🥤 Beverages
- 🍰 Desserts

**Implementation**:
```javascript
// Menu management with staff controls
const Menu = () => {
  const { user } = useUser();
  const [menuItems, setMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  
  // Staff can edit menu items
  const handleEditItem = (item) => {
    if (user?.role === 'STAFF' || user?.role === 'ADMIN') {
      setEditingItem(item);
      // Open edit modal
    }
  };
  
  const handleUpdateItem = async (itemId, updates) => {
    try {
      await updateMenuItem(itemId, updates);
      showToast('Menu item updated successfully!');
    } catch (error) {
      showToast('Failed to update item', 'error');
    }
  };
  
  return (
    <div className="menu-management">
      {/* Menu items grid with edit controls */}
      {/* Category management */}
      {/* Add new item functionality */}
    </div>
  );
};
```

### 3. Order Management
**Purpose**: Handle customer orders and payments

**Staff-Specific Features**:
- **Order Processing**: Create, update, and manage all orders
- **Status Management**: Update order status (Pending → In Progress → Served)
- **Payment Processing**: Handle payments and receipts
- **Order Modifications**: Add items, modify quantities, apply discounts
- **Customer Service**: Handle special requests and complaints
- **Table Management**: Assign orders to tables

**Order Status Management**:
1. **PENDING** → Order received, awaiting preparation
2. **IN_PROGRESS** → Order being prepared in kitchen
3. **SERVED** → Order ready and served to customer
4. **PAID** → Payment completed
5. **CANCELLED** → Order cancelled

**Implementation**:
```javascript
// Order management with staff controls
const Orders = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Staff can manage all orders
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`);
    } catch (error) {
      showToast('Failed to update order status', 'error');
    }
  };
  
  const handlePayment = async (orderId, paymentData) => {
    try {
      await processPayment(orderId, paymentData);
      showToast('Payment processed successfully!');
    } catch (error) {
      showToast('Payment failed', 'error');
    }
  };
  
  return (
    <div className="order-management">
      {/* Order list with status controls */}
      {/* Payment processing */}
      {/* Order details modal */}
    </div>
  );
};
```

### 4. Inventory Control (Quick Edit)
**Purpose**: Manage stock levels and item availability

**Staff-Specific Features**:
- **Quick Stock Updates**: Fast stock level adjustments
- **Out of Stock Management**: Mark items as unavailable
- **Stock Alerts**: View low stock and out of stock items
- **Bulk Updates**: Update multiple items at once
- **Real-time Sync**: Changes reflect across all components

**Quick Edit Features**:
- **+/- Buttons**: Quick stock increment/decrement
- **Mark Out Button**: Set items as out of stock
- **Search Functionality**: Find items quickly
- **Category Filtering**: Filter by item categories
- **Real-time Updates**: Changes sync across Dashboard and Menu

**Implementation**:
```javascript
// Inventory quick edit for staff
const InventoryQuickEdit = ({ isOpen, onClose, onUpdate, inventoryItems }) => {
  const { user } = useUser();
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Only staff and admin can access
  if (!user || (user.role !== 'STAFF' && user.role !== 'ADMIN')) {
    return null;
  }
  
  const handleStockUpdate = async (itemId, newStock) => {
    try {
      await updateInventoryStock(itemId, newStock);
      // Emit global update event
      emitInventoryUpdate(updatedItem);
      showToast('Stock updated successfully!');
    } catch (error) {
      showToast('Failed to update stock', 'error');
    }
  };
  
  return (
    <div className="inventory-quick-edit">
      {/* Search bar */}
      {/* Item list with quick controls */}
      {/* Stock update buttons */}
    </div>
  );
};
```

### 5. Staff Management
**Purpose**: View and manage staff information

**Staff-Specific Features**:
- **Staff Directory**: View all staff members and their roles
- **Attendance Tracking**: Monitor staff attendance and schedules
- **Staff Details**: View individual staff profiles
- **Role Management**: View staff roles and permissions
- **Staff Performance**: Basic performance metrics

**Implementation**:
```javascript
// Staff management interface
const Staff = () => {
  const { user } = useUser();
  const [staffMembers, setStaffMembers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  
  // Staff can view other staff information
  useEffect(() => {
    fetchStaffMembers();
    fetchAttendance();
  }, []);
  
  return (
    <div className="staff-management">
      {/* Staff directory */}
      {/* Attendance tracking */}
      {/* Staff details */}
    </div>
  );
};
```

### 6. Reservations Management
**Purpose**: Handle table reservations and customer bookings

**Staff-Specific Features**:
- **Reservation Management**: View, create, and update reservations
- **Table Assignment**: Assign tables to reservations
- **Customer Service**: Handle reservation modifications
- **Floor Management**: Manage different restaurant floors
- **Time Management**: Schedule and manage reservation times

**Implementation**:
```javascript
// Reservation management for staff
const Reservation = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(1);
  
  const handleCreateReservation = async (reservationData) => {
    try {
      await createReservation(reservationData);
      showToast('Reservation created successfully!');
    } catch (error) {
      showToast('Failed to create reservation', 'error');
    }
  };
  
  const handleUpdateReservation = async (reservationId, updates) => {
    try {
      await updateReservation(reservationId, updates);
      showToast('Reservation updated successfully!');
    } catch (error) {
      showToast('Failed to update reservation', 'error');
    }
  };
  
  return (
    <div className="reservation-management">
      {/* Floor selection */}
      {/* Table management */}
      {/* Reservation list */}
      {/* Create/edit reservation forms */}
    </div>
  );
};
```

### 7. Profile Management
**Purpose**: Manage staff personal information

**Features**:
- **Personal Information**: Name, email, phone number
- **Profile Image**: Upload and manage profile picture
- **Role Information**: View current role and permissions
- **Account Settings**: Password changes, notification preferences
- **Activity History**: View recent activities and actions

**Implementation**:
```javascript
// Profile management for staff
const Profile = () => {
  const { user, updateUser } = useUser();
  const [profileImage, setProfileImage] = useState(user?.profileImage);
  
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('profileImage', file);
    
    try {
      const response = await uploadProfileImage(formData);
      setProfileImage(response.imageUrl);
      updateUser({ profileImage: response.imageUrl });
      showToast('Profile image updated successfully!');
    } catch (error) {
      showToast('Failed to upload image', 'error');
    }
  };
  
  return (
    <div className="profile-management">
      {/* Profile image upload */}
      {/* Personal information form */}
      {/* Role and permissions display */}
    </div>
  );
};
```

### 8. Notifications
**Purpose**: Receive operational updates and alerts

**Notification Types**:
- **Order Updates**: New orders, status changes
- **Inventory Alerts**: Low stock, out of stock items
- **Reservation Updates**: New bookings, cancellations
- **Staff Updates**: Schedule changes, announcements
- **System Alerts**: Maintenance, updates

**Implementation**:
```javascript
// Notification system for staff
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  
  const notificationTypes = {
    'order': { icon: '🛒', color: '#2196F3' },
    'inventory': { icon: '📦', color: '#FF9800' },
    'reservation': { icon: '📅', color: '#4CAF50' },
    'staff': { icon: '👥', color: '#9C27B0' },
    'system': { icon: '⚙️', color: '#607D8B' }
  };
  
  return (
    <div className="notifications">
      {notifications.map(notification => (
        <NotificationCard 
          key={notification.id}
          notification={notification}
          type={notificationTypes[notification.type]}
        />
      ))}
    </div>
  );
};
```

---

## Technical Implementation

### Frontend Architecture

#### 1. Role-Based Access Control
```javascript
// RoleProtectedRoute component for staff
const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useUser();
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <RestrictedAccess />;
  }
  
  return children;
};

// Route protection for staff features
<Route 
  path="/inventory" 
  element={
    <RoleProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
      <Inventory />
    </RoleProtectedRoute>
  } 
/>
```

#### 2. Staff-Specific Navigation
```javascript
// Sidebar.jsx - Staff navigation
const getNavigationItems = (userRole) => {
  const baseItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/menu', label: 'Menu', icon: '🍽️' },
    { path: '/orders', label: 'Orders', icon: '🛒' },
    { path: '/reservations', label: 'Reservations', icon: '📅' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' }
  ];
  
  // Staff sees operational features
  if (userRole === 'STAFF') {
    return [
      ...baseItems,
      { path: '/staff', label: 'Staff', icon: '👥' },
      { path: '/inventory', label: 'Inventory', icon: '📦' }
    ];
  }
  
  // Admin sees all features
  if (userRole === 'ADMIN') {
    return [
      ...baseItems,
      { path: '/staff', label: 'Staff', icon: '👥' },
      { path: '/inventory', label: 'Inventory', icon: '📦' },
      { path: '/reports', label: 'Reports', icon: '📊' }
    ];
  }
  
  return baseItems; // Customer features only
};
```

#### 3. Inventory Quick Edit System
```javascript
// InventoryQuickEdit component
const InventoryQuickEdit = ({ isOpen, onClose, onUpdate, inventoryItems }) => {
  const { user } = useUser();
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Role-based access control
  if (!user || (user.role !== 'STAFF' && user.role !== 'ADMIN')) {
    return null;
  }
  
  const handleStockUpdate = async (itemId, newStock) => {
    try {
      await updateInventoryStock(itemId, newStock);
      // Emit global update event
      emitInventoryUpdate(updatedItem);
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };
  
  return (
    <div className="inventory-quick-edit-modal">
      {/* Search functionality */}
      {/* Item list with quick controls */}
      {/* Stock update buttons */}
    </div>
  );
};
```

### Backend Implementation

#### 1. Staff Authentication
```javascript
// middleware/auth.js
const requireAuth = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });
      
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      
      // Staff and Admin can access staff features
      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
};
```

#### 2. Inventory Management API
```javascript
// routes/inventory.js
// Update inventory stock - staff and admin only
router.put('/:id/stock', requireAuth(['STAFF', 'ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ error: 'Invalid stock value' });
    }
    
    const updatedItem = await prisma.inventoryItem.update({
      where: { id },
      data: { 
        quantity: stock,
        updatedAt: new Date()
      }
    });
    
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

// Get inventory items - staff and admin only
router.get('/', requireAuth(['STAFF', 'ADMIN']), async (req, res) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      orderBy: { name: 'asc' }
    });
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory items' });
  }
});
```

#### 3. Order Management API
```javascript
// routes/orders.js
// Update order status - staff and admin only
router.put('/:id/status', requireAuth(['STAFF', 'ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['PENDING', 'IN_PROGRESS', 'SERVED', 'PAID', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { 
        status,
        updatedAt: new Date()
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
        user: true
      }
    });
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});
```

---

## User Interface Components

### 1. Staff Dashboard
**Location**: Main dashboard for staff operations
**Features**:
- Real-time order status overview
- Inventory alerts and notifications
- Quick action buttons for common tasks
- Staff performance metrics
- Recent activity feed

**Implementation**:
```javascript
const StaffDashboard = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  
  return (
    <div className="staff-dashboard">
      {/* Order status cards */}
      <div className="order-status-overview">
        <StatusCard title="Pending Orders" count={pendingCount} color="#FFA500" />
        <StatusCard title="In Progress" count={inProgressCount} color="#2196F3" />
        <StatusCard title="Served" count={servedCount} color="#4CAF50" />
      </div>
      
      {/* Inventory alerts */}
      <div className="inventory-alerts">
        <AlertCard 
          title="Low Stock Items" 
          items={lowStockItems}
          action="Update Stock"
        />
      </div>
      
      {/* Quick actions */}
      <div className="quick-actions">
        <QuickActionButton 
          icon="📦" 
          label="Quick Edit Inventory"
          onClick={() => openInventoryQuickEdit()}
        />
        <QuickActionButton 
          icon="🛒" 
          label="New Order"
          onClick={() => navigate('/orders')}
        />
      </div>
    </div>
  );
};
```

### 2. Inventory Quick Edit Modal
**Purpose**: Fast stock level management for staff
**Features**:
- Search and filter items
- Quick +/- stock adjustments
- Mark items as out of stock
- Real-time updates across system
- Bulk operations

```javascript
const InventoryQuickEditModal = ({ isOpen, onClose, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [updatingItems, setUpdatingItems] = useState(new Set());
  
  const handleStockUpdate = async (itemId, newStock) => {
    setUpdatingItems(prev => new Set(prev).add(itemId));
    
    try {
      await updateInventoryStock(itemId, newStock);
      // Emit global update
      emitInventoryUpdate(updatedItem);
      onUpdate(updatedItem);
    } catch (error) {
      showToast('Failed to update stock', 'error');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };
  
  return (
    <div className="inventory-quick-edit-modal">
      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Items list */}
      <div className="items-list">
        {filteredItems.map(item => (
          <InventoryItemCard
            key={item.id}
            item={item}
            onStockUpdate={handleStockUpdate}
            isUpdating={updatingItems.has(item.id)}
          />
        ))}
      </div>
    </div>
  );
};
```

### 3. Order Management Interface
**Purpose**: Handle orders with staff controls
**Features**:
- Order status management
- Payment processing
- Order modifications
- Customer information
- Table assignments

```javascript
const OrderManagementCard = ({ order, onStatusUpdate, onPayment }) => {
  const { user } = useUser();
  
  const getStatusColor = (status) => {
    const colors = {
      'PENDING': '#FFA500',
      'IN_PROGRESS': '#2196F3',
      'SERVED': '#4CAF50',
      'PAID': '#8BC34A',
      'CANCELLED': '#F44336'
    };
    return colors[status] || '#777979';
  };
  
  return (
    <div className="order-management-card">
      <div className="order-header">
        <h3>Order #{order.orderNumber}</h3>
        <span 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(order.status) }}
        >
          {order.status}
        </span>
      </div>
      
      <div className="order-details">
        <div className="customer-info">
          <span>Customer: {order.customer?.name || 'Walk-in'}</span>
          <span>Table: {order.table?.number || 'N/A'}</span>
        </div>
        
        <div className="order-items">
          {order.items.map(item => (
            <div key={item.id} className="order-item">
              <span>{item.menuItem.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="order-actions">
        {/* Status update buttons */}
        <div className="status-buttons">
          <button 
            onClick={() => onStatusUpdate(order.id, 'IN_PROGRESS')}
            disabled={order.status !== 'PENDING'}
          >
            Start Preparing
          </button>
          <button 
            onClick={() => onStatusUpdate(order.id, 'SERVED')}
            disabled={order.status !== 'IN_PROGRESS'}
          >
            Mark Served
          </button>
        </div>
        
        {/* Payment processing */}
        {order.status === 'SERVED' && (
          <button 
            onClick={() => onPayment(order)}
            className="payment-button"
          >
            💳 Process Payment
          </button>
        )}
      </div>
    </div>
  );
};
```

---

## Database Schema

### User Model (Staff)
```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  role         Role     // USER, STAFF, ADMIN
  name         String
  phone        String?
  profileImage String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  orders        Order[]
  reservations  Reservation[]
  notifications Notification[]
}

enum Role {
  USER
  STAFF
  ADMIN
}
```

### Inventory Model
```prisma
model InventoryItem {
  id        String   @id @default(cuid())
  name      String
  sku       String?  @unique
  quantity  Float    @default(0)
  unit      String
  parLevel  Float?
  costCents Int?
  updatedAt DateTime @updatedAt
  createdAt DateTime @default(now())
}
```

### Order Model
```prisma
model Order {
  id         String      @id @default(cuid())
  status     OrderStatus @default(PENDING)
  user       User?       @relation(fields: [userId], references: [id])
  userId     String?
  table      Table?      @relation(fields: [tableId], references: [id])
  tableId    String?
  totalCents Int         @default(0)
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  items      OrderItem[]
  payments   Payment[]
}

enum OrderStatus {
  PENDING
  IN_PROGRESS
  SERVED
  PAID
  CANCELLED
}
```

---

## API Endpoints

### Authentication
```javascript
POST /api/auth/login
// Staff login
{
  "email": "staff@cosypos.app",
  "password": "staff123"
}

GET /api/auth/me
// Get current staff info
// Returns: { user: { id, name, email, role, profileImage } }
```

### Inventory Management
```javascript
GET /api/inventory
// Get all inventory items
// Headers: Authorization: Bearer <token>
// Returns: Array of inventory items

PUT /api/inventory/:id/stock
// Update stock level
// Body: { stock: 50 }
// Returns: Updated inventory item

PUT /api/inventory/:id/availability
// Update availability status
// Body: { availability: "Out of Stock" }
// Returns: Updated inventory item

PUT /api/inventory/bulk-update
// Bulk update multiple items
// Body: { updates: [{ id, stock }, { id, availability }] }
// Returns: Updated items

GET /api/inventory/alerts/low-stock
// Get low stock items
// Returns: Array of low stock items

GET /api/inventory/alerts/out-of-stock
// Get out of stock items
// Returns: Array of out of stock items
```

### Order Management
```javascript
GET /api/orders
// Get all orders (staff can see all)
// Returns: Array of orders with details

POST /api/orders
// Create new order
// Body: { items: [{ menuItemId, quantity }], tableId?, customerId? }
// Returns: Created order

PUT /api/orders/:id/status
// Update order status
// Body: { status: "IN_PROGRESS" }
// Returns: Updated order

POST /api/orders/:id/payment
// Process payment for order
// Body: { paymentMethod: "CASH", amount: 2500 }
// Returns: Payment confirmation
```

### Staff Management
```javascript
GET /api/staff
// Get all staff members
// Returns: Array of staff members

GET /api/staff/:id
// Get specific staff member
// Returns: Staff member details

GET /api/staff/attendance
// Get staff attendance records
// Returns: Array of attendance records

POST /api/staff/attendance
// Record attendance
// Body: { staffId, checkIn, checkOut? }
// Returns: Attendance record
```

---

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed
- SQLite database
- Git for version control

**SQLite Database Notes:**
- SQLite is best for embedded, single-user or single-process use cases such as development, test suites, and rapid prototyping
- SQLite has no built-in network server, user/role management, or advanced access controls and security depends on OS file permissions
- For production deployments with multiple users or high concurrency, see the project's database migration guidance for migrating to PostgreSQL: [Database Migration Guide](docs/migrations/postgres.md)

### 2. Database Setup
```bash
# Navigate to backend directory
cd cosypos/backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL

# Run database migrations
npx prisma migrate dev

# Seed the database with default users
npm run seed-db
```

### 3. Backend Setup
```bash
# Start the backend server
cd cosypos/backend
npm run dev
# Server runs on http://localhost:4000
```

### 4. Frontend Setup
```bash
# Start the frontend development server
cd cosypos/frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### 5. Staff Account Setup
**Default Staff Account**:
- **Email**: `staff@cosypos.app`
- **Password**: `staff123`
- **Role**: `STAFF`

### 6. Testing Staff Features
1. **Login**: Use staff credentials to access the system
2. **Dashboard**: View operational overview and metrics
3. **Inventory**: Access quick edit functionality for stock management
4. **Orders**: Create and manage customer orders
5. **Menu**: Edit menu items and categories
6. **Staff**: View staff information and attendance
7. **Reservations**: Manage table bookings
8. **Profile**: Update personal information

---

## Troubleshooting

### Common Issues

#### 1. Staff Cannot Access Inventory
**Problem**: Staff sees "Access Restricted" for inventory features
**Solution**: 
- Verify user role is `STAFF` in database
- Check if user is properly authenticated
- Ensure inventory routes are protected with correct roles

#### 2. Quick Edit Modal Not Opening
**Problem**: Inventory quick edit modal doesn't open
**Solution**:
- Check if user has STAFF or ADMIN role
- Verify modal state management
- Ensure proper event handlers are connected

#### 3. Stock Updates Not Reflecting
**Problem**: Stock changes don't appear in other components
**Solution**:
- Check if `emitInventoryUpdate` is being called
- Verify event listeners are properly set up
- Ensure API endpoints are working correctly

#### 4. Order Status Updates Fail
**Problem**: Cannot update order status
**Solution**:
- Verify user has proper permissions
- Check if order status is valid
- Ensure API endpoint is accessible

#### 5. Profile Image Upload Issues
**Problem**: Cannot upload profile images
**Solution**:
- Check file upload permissions
- Verify image file format and size
- Ensure upload API endpoint is working

### Debug Steps

#### 1. Check User Role
```javascript
// In browser console
console.log('Current user:', localStorage.getItem('user'));
console.log('User role:', JSON.parse(localStorage.getItem('user'))?.role);
```

#### 2. Verify API Endpoints
```bash
# Test staff authentication
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"staff@cosypos.app","password":"staff123"}'

# Test inventory endpoint
curl -X GET http://localhost:4000/api/inventory \
  -H "Authorization: Bearer <token>"
```

#### 3. Database Verification
```sql
-- Check staff role
SELECT id, email, role FROM "User" WHERE email = 'staff@cosypos.app';

-- Check inventory items
SELECT * FROM "InventoryItem" LIMIT 5;

-- Check orders
SELECT o.*, u.name as staff_name 
FROM "Order" o 
JOIN "User" u ON o."userId" = u.id 
WHERE u.role = 'STAFF';
```

---

## Future Enhancements

### Planned Features

#### 1. Enhanced Staff Experience
- **Shift Management**: Clock in/out functionality
- **Task Assignment**: Assign specific tasks to staff
- **Performance Tracking**: Track staff performance metrics
- **Training Modules**: Built-in training and onboarding

#### 2. Advanced Inventory Management
- **Automated Reordering**: Set up automatic reorder points
- **Supplier Management**: Track suppliers and purchase orders
- **Cost Tracking**: Monitor item costs and profit margins
- **Waste Management**: Track and reduce food waste

#### 3. Improved Order Management
- **Kitchen Display**: Digital kitchen order display
- **Order Prioritization**: Priority-based order processing
- **Customer Communication**: Direct communication with customers
- **Order Analytics**: Track popular items and trends

#### 4. Staff Communication
- **Internal Messaging**: Staff-to-staff communication
- **Announcements**: Management announcements and updates
- **Shift Notes**: Pass information between shifts
- **Emergency Alerts**: Critical system alerts

#### 5. Mobile Optimization
- **Mobile App**: Dedicated mobile app for staff
- **Offline Mode**: Basic functionality without internet
- **Push Notifications**: Real-time alerts and updates
- **Touch Optimization**: Better mobile interface

### Technical Improvements

#### 1. Performance Optimization
- **Real-time Updates**: WebSocket integration for live updates
- **Caching**: Implement Redis for better performance
- **Lazy Loading**: Load components on demand
- **Image Optimization**: Compress and optimize images

#### 2. Security Enhancements
- **Role Permissions**: Granular permission system
- **Audit Logging**: Track all staff actions
- **Data Encryption**: Encrypt sensitive data
- **Access Control**: IP-based access restrictions

#### 3. Analytics Integration
- **Staff Performance**: Track productivity metrics
- **Inventory Analytics**: Stock movement analysis
- **Order Analytics**: Popular items and patterns
- **Customer Analytics**: Customer behavior insights

---

## Conclusion

The CosyPOS Staff Role provides comprehensive operational management capabilities that allow staff members to:

- **Manage Operations**: Handle day-to-day restaurant operations efficiently
- **Control Inventory**: Quick stock management with real-time updates
- **Process Orders**: Complete order lifecycle from creation to payment
- **Serve Customers**: Manage reservations and customer service
- **Coordinate Team**: View staff information and manage schedules
- **Track Performance**: Monitor operational metrics and alerts

The system is built with modern web technologies, role-based access control, and an intuitive interface that prioritizes operational efficiency while maintaining security and performance.

For technical support or feature requests, please refer to the development team or create an issue in the project repository.
