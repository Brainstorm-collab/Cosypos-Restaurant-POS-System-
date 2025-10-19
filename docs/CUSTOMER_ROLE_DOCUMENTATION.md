# CosyPOS Customer Role Documentation

## Table of Contents
1. [Overview](#overview)
2. [Customer Access & Permissions](#customer-access--permissions)
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

The CosyPOS Customer Role provides a comprehensive dining experience interface for restaurant customers. This role is designed for end-users who want to browse menus, place orders, make reservations, and manage their dining experience.

### Customer Role Characteristics
- **Role Type**: `USER` in the database
- **Access Level**: Customer-facing features only
- **Target Users**: Restaurant customers, diners, guests
- **Primary Functions**: Menu browsing, ordering, reservations, profile management

---

## Customer Access & Permissions

### ✅ **Allowed Features**
| Feature | Access Level | Description |
|---------|-------------|-------------|
| **Dashboard** | Full Access | View restaurant overview, recent activity |
| **Menu Management** | View Only | Browse menu items, view prices, categories |
| **Order Management** | Full Access | Create orders, view order history, make payments |
| **Reservations** | Full Access | Make reservations, view booking history |
| **Profile Management** | Full Access | Update personal information, profile image |
| **Notifications** | Full Access | Receive order updates, reservation confirmations |

### ❌ **Restricted Features**
| Feature | Access Level | Reason |
|---------|-------------|---------|
| **Staff Management** | No Access | Administrative function |
| **Inventory Control** | No Access | Staff-only operation |
| **Reports & Analytics** | No Access | Management function |
| **User Management** | No Access | Administrative function |

---

## Available Features

### 1. Dashboard
**Purpose**: Restaurant overview and customer activity summary

**Features**:
- Restaurant statistics display
- Recent orders summary
- Quick access to popular menu items
- Restaurant information and contact details

**Implementation**:
```javascript
// Dashboard component with customer-specific data
const Dashboard = () => {
  const { user } = useUser();
  // Shows customer-relevant information only
  // Displays recent orders, popular items, etc.
};
```

### 2. Menu Management
**Purpose**: Browse restaurant menu and view item details

**Features**:
- **Menu Categories**: Organized by food types (Pizza, Pasta, Drinks, etc.)
- **Item Details**: Name, description, price, availability
- **Visual Menu**: High-quality food images
- **Search Functionality**: Find items by name or category
- **Filtering**: Filter by dietary preferences, price range

**Menu Categories Available**:
- 🍕 Pizza
- 🍝 Pasta
- 🥗 Salads
- 🍖 Main Courses
- 🥤 Beverages
- 🍰 Desserts

**Implementation**:
```javascript
// Menu browsing with customer-friendly interface
const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Fetch menu items from API
  useEffect(() => {
    fetchMenuItems();
  }, []);
  
  // Display items in customer-friendly format
  return (
    <div className="menu-container">
      {/* Category filters */}
      {/* Menu items grid */}
      {/* Item details modal */}
    </div>
  );
};
```

### 3. Order Management
**Purpose**: Create, view, and manage food orders

**Customer-Specific Features**:
- **Create New Orders**: Add items to cart, specify quantities
- **Order History**: View past orders and their status
- **Order Tracking**: Real-time order status updates
- **Payment Processing**: Secure payment for orders
- **Order Modifications**: Add special requests, dietary notes

**Order Status Flow**:
1. **PENDING** → Order placed, awaiting confirmation
2. **IN_PROGRESS** → Order being prepared
3. **SERVED** → Order ready for pickup/delivery
4. **PAID** → Payment completed, order finished
5. **CANCELLED** → Order cancelled

**Implementation**:
```javascript
// Order management with customer controls
const Orders = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  
  // Customer can only see their own orders
  const customerOrders = orders.filter(order => 
    order.customerId === user?.id
  );
  
  // Customer-specific actions
  const handleCreateOrder = () => {
    // Navigate to order creation
  };
  
  const handlePayOrder = (orderId) => {
    // Process payment for order
  };
  
  return (
    <div>
      {/* Add New Order Button - Only for customers */}
      {user?.role === 'USER' && (
        <button onClick={handleCreateOrder}>
          Add Order
        </button>
      )}
      
      {/* Order list with customer controls */}
      {customerOrders.map(order => (
        <OrderCard 
          key={order.id}
          order={order}
          onPay={() => handlePayOrder(order.id)}
        />
      ))}
    </div>
  );
};
```

### 4. Reservations
**Purpose**: Make and manage table reservations

**Features**:
- **Table Selection**: Choose from available tables
- **Date & Time Picker**: Select preferred dining time
- **Party Size**: Specify number of guests
- **Special Requests**: Dietary requirements, celebrations
- **Reservation History**: View past and upcoming bookings
- **Modification**: Update or cancel existing reservations

**Reservation Process**:
1. Select date and time
2. Choose table and party size
3. Enter customer details
4. Add special requests
5. Confirm reservation
6. Receive confirmation notification

**Implementation**:
```javascript
// Reservation system with customer interface
const Reservation = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [partySize, setPartySize] = useState(2);
  
  const handleCreateReservation = async (reservationData) => {
    try {
      await createReservation({
        ...reservationData,
        customerId: user.id,
        customerName: user.name,
        customerEmail: user.email
      });
      showToast('Reservation created successfully!');
    } catch (error) {
      showToast('Failed to create reservation', 'error');
    }
  };
  
  return (
    <div>
      {/* Date and time selection */}
      {/* Table availability */}
      {/* Customer details form */}
      {/* Special requests */}
    </div>
  );
};
```

### 5. Profile Management
**Purpose**: Manage personal information and preferences

**Features**:
- **Personal Information**: Name, email, phone number
- **Profile Image**: Upload and manage profile picture
- **Preferences**: Dietary restrictions, favorite items
- **Account Settings**: Password changes, notification preferences
- **Order History**: Complete order and reservation history

**Implementation**:
```javascript
// Profile management with image upload
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
    } catch (error) {
      showToast('Failed to upload image', 'error');
    }
  };
  
  return (
    <div>
      {/* Profile image upload */}
      {/* Personal information form */}
      {/* Account settings */}
    </div>
  );
};
```

### 6. Notifications
**Purpose**: Receive updates about orders and reservations

**Notification Types**:
- **Order Updates**: Status changes, preparation progress
- **Reservation Confirmations**: Booking confirmations, reminders
- **Payment Notifications**: Payment confirmations, receipts
- **Special Offers**: Promotional messages, discounts

**Implementation**:
```javascript
// Notification system for customers
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  
  const notificationTypes = {
    'order': { icon: '🛒', color: '#2196F3' },
    'reservation': { icon: '📅', color: '#4CAF50' },
    'payment': { icon: '💳', color: '#FF9800' },
    'promotion': { icon: '🎉', color: '#FAC1D9' }
  };
  
  return (
    <div>
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
// RoleProtectedRoute component
const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useUser();
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <RestrictedAccess />;
  }
  
  return children;
};

// Route protection in main.jsx
<Route 
  path="/orders" 
  element={
    <RoleProtectedRoute allowedRoles={['USER', 'STAFF', 'ADMIN']}>
      <Orders />
    </RoleProtectedRoute>
  } 
/>
```

#### 2. User Context Management
```javascript
// UserContext.jsx
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const login = async (email, password) => {
    const response = await authenticateUser(email, password);
    setUser(response.user);
    localStorage.setItem('token', response.token);
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };
  
  return (
    <UserContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
```

#### 3. Dynamic Sidebar Navigation
```javascript
// Sidebar.jsx - Role-based navigation
const getNavigationItems = (userRole) => {
  const baseItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/menu', label: 'Menu', icon: '🍽️' },
    { path: '/orders', label: 'Orders', icon: '🛒' },
    { path: '/reservations', label: 'Reservations', icon: '📅' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' }
  ];
  
  // Customer (USER) sees only customer-facing features
  if (userRole === 'USER') {
    return baseItems; // No staff/admin features
  }
  
  // Add staff/admin features for other roles
  return [
    ...baseItems,
    ...(userRole === 'STAFF' || userRole === 'ADMIN' ? [
      { path: '/staff', label: 'Staff', icon: '👥' },
      { path: '/inventory', label: 'Inventory', icon: '📦' }
    ] : []),
    ...(userRole === 'ADMIN' ? [
      { path: '/reports', label: 'Reports', icon: '📊' }
    ] : [])
  ];
};
```

### Backend Implementation

#### 1. Authentication Middleware
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

#### 2. Order Management API
```javascript
// routes/orders.js
// Get orders for specific customer
app.get('/api/orders', requireAuth(['USER', 'STAFF', 'ADMIN']), async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    
    let whereClause = {};
    
    // Customers can only see their own orders
    if (role === 'USER') {
      whereClause.userId = userId;
    }
    
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
        user: true,
        table: true
      }
    });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});
```

#### 3. Reservation API
```javascript
// routes/reservations.js
// Create reservation (customer-specific)
app.post('/api/reservations', requireAuth(['USER', 'STAFF', 'ADMIN']), async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const reservationData = req.body;
    
    // For customers, automatically set customerId
    if (role === 'USER') {
      reservationData.customerId = userId;
    }
    
    const reservation = await prisma.reservation.create({
      data: reservationData,
      include: {
        customer: true
      }
    });
    
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});
```

---

## User Interface Components

### 1. Header Bar
**Location**: Top of every page
**Features**:
- Restaurant logo/branding
- User profile icon with image
- Notifications bell with badge
- Navigation breadcrumbs

**Implementation**:
```javascript
const HeaderBar = ({ title, showBackButton, right }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  return (
    <div className="header-bar">
      <div className="header-left">
        {showBackButton && (
          <button onClick={() => navigate(-1)}>
            ← Back
          </button>
        )}
        <h1>{title}</h1>
      </div>
      
      <div className="header-right">
        {/* Notifications */}
        <button onClick={() => navigate('/notifications')}>
          🔔 <span className="badge">01</span>
        </button>
        
        {/* User Profile */}
        <div onClick={() => navigate('/profile')}>
          <img 
            src={user?.profileImage || '/default-avatar.jpg'} 
            alt="Profile"
            className="profile-image"
          />
        </div>
      </div>
    </div>
  );
};
```

### 2. Order Card Component
**Purpose**: Display individual orders with customer controls
**Features**:
- Order details (items, total, status)
- Status indicator with color coding
- Customer-specific actions (Pay Now button)
- Order history tracking

```javascript
const OrderCard = ({ order, onPay, onViewDetails }) => {
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
    <div className="order-card">
      <div className="order-header">
        <h3>Order #{order.orderNumber}</h3>
        <span 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(order.status) }}
        >
          {order.status}
        </span>
      </div>
      
      <div className="order-items">
        {order.items.map(item => (
          <div key={item.id} className="order-item">
            <span>{item.name} × {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      
      <div className="order-footer">
        <div className="order-total">
          Total: ${order.subtotal.toFixed(2)}
        </div>
        
        {/* Customer-specific actions */}
        {user?.role === 'USER' && 
         order.customerId === user?.id && 
         (order.status === 'SERVED' || order.status === 'PENDING') && (
          <button 
            onClick={() => onPay(order)}
            className="pay-button"
          >
            💳 Pay Now
          </button>
        )}
      </div>
    </div>
  );
};
```

### 3. Menu Item Component
**Purpose**: Display menu items with customer interaction
**Features**:
- High-quality food images
- Price display
- Add to cart functionality
- Item details modal
- Availability status

```javascript
const MenuItem = ({ item, onAddToCart }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div className="menu-item">
      <div 
        className="item-image"
        onClick={() => setShowDetails(true)}
      >
        <img src={item.image} alt={item.name} />
        <div className="item-overlay">
          <span>View Details</span>
        </div>
      </div>
      
      <div className="item-info">
        <h3>{item.name}</h3>
        <p className="item-description">{item.description}</p>
        <div className="item-price">${item.price}</div>
        
        <button 
          onClick={() => onAddToCart(item)}
          className="add-to-cart"
          disabled={!item.available}
        >
          {item.available ? 'Add to Cart' : 'Unavailable'}
        </button>
      </div>
      
      {showDetails && (
        <ItemDetailsModal 
          item={item}
          onClose={() => setShowDetails(false)}
          onAddToCart={onAddToCart}
        />
      )}
    </div>
  );
};
```

---

## Database Schema

### User Model
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

### Reservation Model
```prisma
model Reservation {
  id               String            @id @default(cuid())
  customer         User              @relation(fields: [customerId], references: [id])
  customerId       String
  tableNumber      String
  floor            Int
  paxNumber        Int
  reservationDate  DateTime
  startTime        String
  endTime          String
  depositFee       Float             @default(0)
  status           ReservationStatus @default(PENDING)
  paymentMethod    String            @default("CASH")
  specialRequests  String?
  customerTitle    String            @default("Mr")
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
}

enum ReservationStatus {
  PENDING
  CONFIRMED
  CANCELLED
  NO_SHOW
  COMPLETED
}
```

---

## API Endpoints

### Authentication
```javascript
POST /api/auth/login
// Customer login
{
  "email": "customer@cosypos.app",
  "password": "customer123"
}

GET /api/auth/me
// Get current user info
// Returns: { user: { id, name, email, role, profileImage } }
```

### Orders
```javascript
GET /api/orders
// Get customer's orders
// Headers: Authorization: Bearer <token>
// Returns: Array of orders with items and status

POST /api/orders
// Create new order
// Body: { items: [{ menuItemId, quantity }], tableId?, specialRequests? }
// Returns: Created order with ID

PUT /api/orders/:id
// Update order status (limited for customers)
// Body: { status: "CANCELLED" }
// Returns: Updated order

GET /api/orders/:id
// Get specific order details
// Returns: Order with full details
```

### Reservations
```javascript
GET /api/reservations
// Get customer's reservations
// Returns: Array of reservations

POST /api/reservations
// Create new reservation
// Body: {
//   tableNumber: "A1",
//   floor: 1,
//   paxNumber: 4,
//   reservationDate: "2024-01-20",
//   startTime: "19:00",
//   endTime: "21:00",
//   specialRequests: "Birthday celebration"
// }
// Returns: Created reservation

PUT /api/reservations/:id
// Update reservation
// Body: { status: "CANCELLED" }
// Returns: Updated reservation
```

### Menu
```javascript
GET /api/menu
// Get all menu items
// Returns: Array of menu items with categories

GET /api/menu/categories
// Get menu categories
// Returns: Array of categories with item counts
```

### Profile
```javascript
PUT /api/profile
// Update customer profile
// Body: { name?, phone?, email? }
// Returns: Updated user

POST /api/profile/upload-image
// Upload profile image
// Content-Type: multipart/form-data
// Body: { profileImage: File }
// Returns: { imageUrl: string }
```

---

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed
- SQLite database
- Git for version control

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

### 5. Customer Account Setup
**Default Customer Account**:
- **Email**: `customer@cosypos.app`
- **Password**: `customer123`
- **Role**: `USER`

### 6. Testing Customer Features
1. **Login**: Use customer credentials to access the system
2. **Browse Menu**: Navigate to Menu page to see available items
3. **Create Order**: Go to Orders page and click "Add Order"
4. **Make Reservation**: Visit Reservations page to book a table
5. **Update Profile**: Go to Profile page to manage personal information
6. **View Notifications**: Check Notifications page for updates

---

## Troubleshooting

### Common Issues

#### 1. Customer Cannot Access Features
**Problem**: Customer sees "Access Restricted" page
**Solution**: 
- Verify user role is `USER` in database
- Check if user is properly authenticated
- Ensure token is valid and not expired

#### 2. Profile Image Not Loading
**Problem**: Profile image shows as broken or default
**Solution**:
- Check if image file exists in uploads directory
- Verify file permissions
- Ensure API endpoint is returning correct URL

#### 3. Orders Not Showing
**Problem**: Customer cannot see their orders
**Solution**:
- Verify `userId` matches in order records
- Check if orders are being filtered correctly
- Ensure API is returning customer-specific orders

#### 4. Reservation Creation Fails
**Problem**: Cannot create new reservations
**Solution**:
- Check if table is available for selected time
- Verify date/time format is correct
- Ensure customer ID is being set automatically

#### 5. Payment Processing Issues
**Problem**: Payment button not working
**Solution**:
- Verify order status allows payment
- Check if customer owns the order
- Ensure payment API is properly configured

### Debug Steps

#### 1. Check User Role
```javascript
// In browser console
console.log('Current user:', localStorage.getItem('user'));
console.log('User role:', JSON.parse(localStorage.getItem('user'))?.role);
```

#### 2. Verify API Endpoints
```bash
# Test authentication
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@cosypos.app","password":"customer123"}'

# Test orders endpoint
curl -X GET http://localhost:4000/api/orders \
  -H "Authorization: Bearer <token>"
```

#### 3. Database Verification
```sql
-- Check user role
SELECT id, email, role FROM "User" WHERE email = 'customer@cosypos.app';

-- Check customer orders
SELECT o.*, u.name as customer_name 
FROM "Order" o 
JOIN "User" u ON o."userId" = u.id 
WHERE u.role = 'USER';
```

---

## Future Enhancements

### Planned Features

#### 1. Enhanced Customer Experience
- **Loyalty Program**: Points system for repeat customers
- **Favorites**: Save favorite menu items
- **Dietary Preferences**: Track allergies and dietary restrictions
- **Order Recommendations**: AI-powered menu suggestions

#### 2. Mobile Optimization
- **Responsive Design**: Better mobile experience
- **Touch Gestures**: Swipe navigation for mobile
- **Offline Support**: Basic functionality without internet
- **Push Notifications**: Real-time order updates

#### 3. Advanced Ordering
- **Group Orders**: Multiple people ordering together
- **Scheduled Orders**: Pre-order for future pickup
- **Customization**: Detailed item customization options
- **Split Bills**: Divide orders among multiple customers

#### 4. Reservation Enhancements
- **Table Preferences**: Save preferred table locations
- **Recurring Reservations**: Regular booking schedules
- **Waitlist Management**: Join waitlist when tables full
- **Special Occasions**: Birthday, anniversary celebrations

#### 5. Payment Improvements
- **Multiple Payment Methods**: Credit card, digital wallets
- **Split Payments**: Divide bill among multiple people
- **Tip Management**: Easy tip calculation and payment
- **Receipt Management**: Digital receipt storage

### Technical Improvements

#### 1. Performance Optimization
- **Lazy Loading**: Load components on demand
- **Image Optimization**: Compress and optimize images
- **Caching**: Implement Redis for better performance
- **CDN**: Use content delivery network for assets

#### 2. Security Enhancements
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Enhanced data validation
- **Encryption**: Encrypt sensitive customer data
- **Audit Logging**: Track all customer actions

#### 3. Analytics Integration
- **Customer Behavior**: Track usage patterns
- **Order Analytics**: Popular items and trends
- **Performance Metrics**: Page load times, user engagement
- **A/B Testing**: Test different UI variations

---

## Conclusion

The CosyPOS Customer Role provides a comprehensive dining experience interface that allows customers to:

- **Browse and explore** restaurant menus with rich visual content
- **Create and manage** food orders with real-time status tracking
- **Make reservations** for tables with flexible scheduling
- **Manage their profile** with personal information and preferences
- **Receive notifications** about orders and reservations
- **Process payments** securely for completed orders

The system is built with modern web technologies, role-based access control, and a user-friendly interface that prioritizes the customer experience while maintaining security and performance.

For technical support or feature requests, please refer to the development team or create an issue in the project repository.
