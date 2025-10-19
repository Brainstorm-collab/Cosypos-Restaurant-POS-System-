# COSYPOS - Modern Point of Sale System

![COSYPOS Demo](https://raw.githubusercontent.com/Brainstorm-collab/cosypos/master/public/demo-cosypos.png)

**COSYPOS** is a comprehensive, modern Point of Sale (POS) system designed for restaurants and food service businesses. Built with React, Node.js, and SQLite, it provides a complete solution for managing orders, inventory, staff, reservations, and business analytics.

## 🚀 Features

### 📊 Dashboard & Analytics
- **Real-time Dashboard** with key performance indicators
- **Daily Sales Tracking** with visual charts
- **Monthly Revenue Reports** with trend analysis
- **Table Occupancy Monitoring** for optimal seating management
- **Popular Dishes Analytics** with stock status tracking

### 🍽️ Menu Management
- **Dynamic Menu System** with categories and items
- **Price Management** with flexible pricing options
- **Availability Control** for real-time menu updates
- **Stock Integration** linking menu items to inventory

### 👥 Staff Management
- **Role-based Access Control** (Admin, Staff, User)
- **Staff Attendance Tracking** with clock-in/out functionality
- **Break Time Management** for accurate payroll
- **Staff Performance Analytics**

### 📦 Inventory Management
- **Real-time Stock Tracking** with SKU management
- **Par Level Monitoring** for automatic reorder alerts
- **Cost Tracking** for profit margin analysis
- **Unit Management** for different measurement types

### 🍴 Order Management
- **Table-based Ordering** with visual table status
- **Order Status Tracking** (Pending, In Progress, Served, Paid, Cancelled)
- **Payment Processing** with multiple payment methods
- **Order History** and analytics

### 📅 Reservation System
- **Table Reservation Management** with time slots
- **Customer Information Tracking**
- **Reservation Status Management** (Pending, Confirmed, Cancelled, No Show)
- **Table Assignment** and conflict prevention

### 📈 Reports & Analytics
- **Sales Reports** with filtering options (Daily, Weekly, Monthly)
- **Revenue Analytics** with export capabilities
- **Staff Performance Reports**
- **Inventory Reports** with cost analysis

### 🔔 Notifications
- **Real-time Notifications** for orders, reservations, and alerts
- **Multi-channel Notifications** (in-app, email, SMS)
- **Customizable Notification Settings**

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful icon library
- **Recharts** - Data visualization and charts
- **React Icons** - Additional icon components

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Prisma** - Modern database ORM
- **SQLite** - Lightweight database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Database Schema
The system uses a comprehensive SQLite schema with the following main entities:
- **Users** - Authentication and role management
- **Menu Categories & Items** - Menu structure
- **Inventory Items** - Stock management
- **Tables** - Restaurant table management
- **Orders & Order Items** - Order processing
- **Reservations** - Booking management
- **Attendance** - Staff time tracking
- **Payments** - Transaction processing
- **Notifications** - Alert system

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- SQLite database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Brainstorm-collab/cosypos.git
   cd cosypos
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Database Setup**
   ```bash
   cd ../backend
   npx prisma generate
   npx prisma db push
   ```

5. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-jwt-secret-key"
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📱 User Interface

The application features a modern, dark-themed interface with:
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Theme** with pink accent colors for better user experience
- **Intuitive Navigation** with sidebar menu
- **Real-time Updates** with live data synchronization
- **Professional Dashboard** with key metrics and charts

## 🔐 Authentication & Security

- **JWT-based Authentication** for secure user sessions
- **Role-based Access Control** with different permission levels
- **Password Hashing** using bcrypt for security
- **Protected Routes** ensuring only authenticated users can access features

## 📊 Key Metrics Dashboard

The dashboard provides real-time insights into:
- **Daily Sales** - Current day revenue tracking
- **Monthly Revenue** - Monthly performance analysis
- **Table Occupancy** - Current table status and capacity
- **Popular Dishes** - Best-selling items with stock status
- **Export Functionality** - Data export in multiple formats

## 🎯 Target Users

- **Restaurant Owners** - Complete business management
- **Restaurant Managers** - Staff and inventory oversight
- **Wait Staff** - Order taking and table management
- **Kitchen Staff** - Order processing and inventory updates

## 🔄 Development

### Project Structure
```
cosypos/
├── backend/           # Node.js/Express API
│   ├── src/
│   │   ├── routes/   # API endpoints
│   │   ├── middleware/ # Authentication & validation
│   │   └── lib/      # Database connection
│   └── prisma/       # Database schema & migrations
└── frontend/         # React application
    ├── src/
    │   ├── components/ # React components
    │   └── pages/     # Page components
    └── public/       # Static assets
```

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend:**
- `npm run dev` - Start development server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the package.json files for details.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**COSYPOS** - Modernizing restaurant management with technology.