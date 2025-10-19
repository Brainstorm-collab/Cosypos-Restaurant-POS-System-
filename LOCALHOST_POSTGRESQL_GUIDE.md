# Localhost PostgreSQL Setup Guide

## 🎯 Goal: Use PostgreSQL for localhost development with profile image upload

You have **3 options** to set up PostgreSQL locally:

## Option 1: Docker PostgreSQL (Recommended - Easiest)

### Prerequisites:
- Install Docker Desktop from: https://www.docker.com/products/docker-desktop

### Setup:
```bash
# Run the Docker setup script
.\setup-docker-postgres.bat
```

### Benefits:
- ✅ No manual PostgreSQL installation
- ✅ Isolated environment
- ✅ Easy to start/stop
- ✅ Same PostgreSQL version as production

---

## Option 2: Manual PostgreSQL Installation

### Prerequisites:
- Download and install PostgreSQL from: https://www.postgresql.org/download/windows/

### Setup:
```bash
# Run the manual setup script
.\setup-local-postgresql.bat
```

### Benefits:
- ✅ Full control over PostgreSQL
- ✅ Can use GUI tools like pgAdmin
- ✅ Direct database access

---

## Option 3: Use Production Database (Quick Test)

### Setup:
```bash
# Run the frontend-only setup
.\setup-local-frontend.bat
```

### Benefits:
- ✅ No local database setup needed
- ✅ Uses production data
- ✅ Quick to test

---

## 🚀 After Setup - Starting the Application

### 1. Start Backend:
```bash
npm run dev
```
Backend will run on: http://localhost:4000

### 2. Start Frontend:
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:5173

---

## 📸 Profile Image Upload Testing

Once running locally:

1. **Login** with any user:
   - Admin: `admin@cosypos.app` / `pass123`
   - Staff: `staff@cosypos.app` / `staff123`
   - Customer: `customer@cosypos.app` / `customer123`

2. **Go to Profile** → My Profile

3. **Click on profile picture** to upload

4. **Select image file** (max 5MB)

5. **Image will be saved** to local PostgreSQL database

6. **Test persistence**:
   - Refresh the page → Image should still be there
   - Logout and login again → Image should persist
   - Restart the application → Image should persist

---

## 🗂️ File Storage Locations

### Local Development:
- **Database**: Local PostgreSQL database
- **Files**: `./uploads/profiles/` directory
- **Persistence**: Both database and file system

### Production:
- **Database**: PostgreSQL on Render
- **Files**: `./uploads/profiles/` on Render
- **Persistence**: Both database and file system

---

## 🐛 Troubleshooting

### PostgreSQL Connection Issues:
```bash
# Check if PostgreSQL is running
docker ps  # For Docker setup

# Or check Windows services for manual setup
services.msc
```

### Port Conflicts:
- Backend: Change PORT in .env file
- Frontend: Change port in frontend/.env or package.json
- PostgreSQL: Change port in docker-compose.yml or PostgreSQL config

### Database Reset:
```bash
# Reset database and reseed
npx prisma db push --force-reset
node src/seed.js
```

---

## ✅ What You'll Get

After setup, you'll have:

- ✅ **Local PostgreSQL database** with all your data
- ✅ **Profile image upload** working locally
- ✅ **Persistent data** across sessions
- ✅ **Same functionality** as production
- ✅ **Fast development** with local database
- ✅ **Easy testing** of all features

---

## 🎯 Recommended Approach

**Use Option 1 (Docker)** because:
- Easiest setup
- Same environment as production
- Easy to reset if needed
- No system-wide PostgreSQL installation

Just run: `.\setup-docker-postgres.bat` and you're ready to go!
