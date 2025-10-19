# CosyPOS - Restaurant Management System

A complete restaurant management system with PostgreSQL database, built with Node.js backend and React frontend.

## 🏗️ Project Structure

```
cosypos/
├── backend/                 # Backend API (Node.js + Express + Prisma)
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Authentication middleware
│   │   ├── lib/           # Database connection
│   │   └── index.js       # Main server file
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   ├── uploads/           # File uploads (images)
│   └── package.json
├── frontend/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── api.js        # API client
│   │   └── main.jsx      # Main app file
│   ├── public/           # Static assets
│   └── package.json
└── README.md
```

## 🚀 Live Deployment

- **Frontend**: https://cosypos-frontend.onrender.com
- **Backend**: https://cosyposy-duplicate.onrender.com

## 🗄️ Database

- **Type**: PostgreSQL
- **Hosted**: Render.com
- **ORM**: Prisma

## 👥 Default Users

### Admin
- **Email**: `admin@cosypos.app`
- **Password**: `pass123`
- **Role**: ADMIN

### Staff
- **Email**: `staff@cosypos.app`
- **Password**: `staff123`
- **Role**: STAFF

### Customer
- **Email**: `customer@cosypos.app`
- **Password**: `customer123`
- **Role**: USER

## 🛠️ Local Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📋 Features

- ✅ User Authentication & Authorization
- ✅ Menu Management
- ✅ Order Processing
- ✅ Inventory Management
- ✅ Staff Management
- ✅ Reservation System
- ✅ Reports & Analytics
- ✅ File Upload (Images)
- ✅ Role-based Access Control

## 🔧 Tech Stack

**Backend:**
- Node.js + Express
- PostgreSQL + Prisma
- JWT Authentication
- Multer (File Upload)

**Frontend:**
- React + Vite
- React Router
- Context API
- Axios

## 📚 Documentation

- [Staff Role Documentation](./STAFF_ROLE_DOCUMENTATION.md)
- [Customer Role Documentation](./CUSTOMER_ROLE_DOCUMENTATION.md)
- [Performance Optimizations](./PERFORMANCE_OPTIMIZATIONS.md)

---

**Status**: ✅ Production Ready
**Last Updated**: October 2024