# Local Development Setup Guide

## 🚀 Quick Setup (Automated)

Run the setup script:
```bash
setup-local.bat
```

## 🔧 Manual Setup

### 1. Backend Setup

1. **Create `.env` file in root directory:**
```env
DATABASE_URL=postgresql://cosypos_user:cosypos_password@dpg-d3qkenmmcj7s73bq3570-a:5432/cosypos
JWT_SECRET=cosypos-super-secret-jwt-key-2024
NODE_ENV=development
PORT=4000
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

2. **Install dependencies:**
```bash
npm install
```

3. **Generate Prisma client:**
```bash
npx prisma generate
```

4. **Push database schema:**
```bash
npx prisma db push
```

5. **Seed the database:**
```bash
node src/seed.js
```

6. **Start the backend:**
```bash
npm run dev
```

### 2. Frontend Setup

1. **Create `frontend/.env` file:**
```env
VITE_API_URL=http://localhost:4000
```

2. **Install dependencies:**
```bash
cd frontend
npm install
```

3. **Start the frontend:**
```bash
npm run dev
```

## 🌐 Access URLs

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:4000

## 🔑 Default Login Credentials

- **Admin**: `admin@cosypos.app` / `pass123`
- **Staff**: `staff@cosypos.app` / `staff123`
- **Customer**: `customer@cosypos.app` / `customer123`

## 📸 Profile Image Upload

The profile image upload functionality works in both localhost and production:

1. **Login** to the application
2. **Go to Profile** → My Profile
3. **Click on profile picture** to upload
4. **Select image file** (max 5MB)
5. **Image will be saved** permanently to database and file system
6. **Image persists** after refresh/logout

## 🗂️ File Storage

- **Local uploads**: `./uploads/profiles/`
- **Database**: PostgreSQL `profileImage` field
- **Persistence**: Survives restart, logout, and refresh

## 🐛 Troubleshooting

### Backend Issues
- Ensure PostgreSQL database is accessible
- Check `.env` file configuration
- Verify Prisma client is generated
- Check port 4000 is available

### Frontend Issues
- Ensure backend is running on port 4000
- Check `frontend/.env` file exists
- Verify VITE_API_URL is correct
- Check port 5173 is available

### Profile Image Issues
- Check uploads directory permissions
- Verify file size is under 5MB
- Ensure file is a valid image format
- Check browser console for errors
