# CosyPOS - Restaurant Management System

A modern, full-stack restaurant management system built with React and Node.js, featuring PostgreSQL database integration and comprehensive role-based access control.

## 🏗️ Project Structure

```
cosypos/
├── backend-deploy/          # Backend deployment files
│   ├── src/                 # Backend source code
│   ├── prisma/              # Database schema
│   ├── uploads/             # File uploads (images)
│   └── package.json         # Backend dependencies
│
├── frontend-deploy/         # Frontend deployment files
│   ├── src/                 # React components
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
│
├── docs/                    # Documentation
├── scripts/                 # Utility scripts
└── deployment/              # Deployment configurations
```

## 🚀 Quick Start

### Prerequisites
- Node.js 22.16.0+
- PostgreSQL database
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Brainstorm-collab/cosyposy-duplicate.git
   cd cosyposy-duplicate
   ```

2. **Setup Backend**
   ```bash
   cd backend-deploy
   npm install
   cp .env.example .env  # Configure your database
   npx prisma generate
   npx prisma db push
   npm run seed
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend-deploy
   npm install
   cp .env.example .env  # Configure API URL
   npm run dev
   ```

## 🌐 Deployment

### Render.com Deployment

#### Backend Service Configuration:
- **Service Type:** Web Service
- **Root Directory:** `backend-deploy`
- **Build Command:** `npm install && npx prisma generate && npx prisma db push && node src/seed.js`
- **Start Command:** `npm run dev`
- **Node Version:** 22.16.0

#### Frontend Service Configuration:
- **Service Type:** Static Site
- **Root Directory:** `frontend-deploy`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Node Version:** 22.16.0

### Environment Variables

#### Backend:
```
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-jwt-secret
NODE_ENV=production
PORT=4000
```

#### Frontend:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

## 👥 User Roles

- **Admin:** Full system access
- **Staff:** Limited access to orders, reservations, inventory
- **Customer:** View menu, place orders, make reservations

### Default Login Credentials:
- **Admin:** admin@cosypos.app / pass123
- **Staff:** staff@cosypos.app / staff123
- **Customer:** customer@cosypos.app / customer123

## 📚 Documentation

- [Customer Role Documentation](docs/CUSTOMER_ROLE_DOCUMENTATION.md)
- [Staff Role Documentation](docs/STAFF_ROLE_DOCUMENTATION.md)
- [Performance Optimizations](docs/PERFORMANCE_OPTIMIZATIONS.md)

## 🛠️ Features

- **User Management:** Role-based access control
- **Menu Management:** Dynamic menu with categories
- **Order Processing:** Complete order workflow
- **Inventory Management:** Stock tracking and alerts
- **Reservation System:** Table booking and management
- **Staff Management:** Employee tracking and attendance
- **Reports & Analytics:** Comprehensive reporting
- **File Uploads:** Profile images and menu items
- **Real-time Updates:** Live data synchronization

## 🗄️ Database

- **PostgreSQL** for production
- **Prisma ORM** for database operations
- **Automatic migrations** and seeding

## 🔧 Technology Stack

- **Frontend:** React 19, Vite, React Router
- **Backend:** Node.js, Express, Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT
- **File Upload:** Multer
- **Deployment:** Render.com

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please contact the development team.
