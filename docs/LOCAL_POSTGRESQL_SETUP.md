# 🏠 Local PostgreSQL Setup Guide

## ⚠️ **IMPORTANT: Local Development Needs PostgreSQL Configuration**

Currently, your local development environment may still be using SQLite. Here's how to configure it for PostgreSQL:

## 🔧 **Step 1: Install PostgreSQL Locally**

### Windows:
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember the password you set for the `postgres` user

### macOS:
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## 🗄️ **Step 2: Create Local Database**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database for local development
CREATE DATABASE cosypos_local;

# Create user (optional)
CREATE USER cosypos_user WITH PASSWORD 'cosypos_password';
GRANT ALL PRIVILEGES ON DATABASE cosypos_local TO cosypos_user;

# Exit psql
\q
```

## 📝 **Step 3: Create Local Environment File**

Create a `.env` file in `backend-deploy/` directory:

```bash
# Local Development Environment Variables
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/cosypos_local"
JWT_SECRET="local-development-jwt-secret-key"
NODE_ENV="development"
PORT=4000
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
CORS_ORIGIN="http://localhost:5173"
```

## 🚀 **Step 4: Setup Local Development**

```bash
cd backend-deploy

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to local PostgreSQL database
npx prisma db push

# Seed the database
node src/seed.js

# Start development server
npm run dev
```

## ✅ **Step 5: Verify Local PostgreSQL Setup**

```bash
# Run verification script
npm run verify:postgresql
```

This will test:
- ✅ PostgreSQL connection
- ✅ Database schema
- ✅ Profile image functionality
- ✅ All required tables

## 🔄 **Step 6: Remove SQLite Files**

After confirming PostgreSQL is working:

```bash
# Remove SQLite database file
rm prisma/dev.db

# Verify no SQLite references remain
grep -r "sqlite" . --exclude-dir=node_modules
```

## 🎯 **Local Development Features**

### Profile Image Testing:
1. **Start Backend**: `npm run dev` (port 4000)
2. **Start Frontend**: `npm run dev` (port 5173)
3. **Login as Admin**: Use admin credentials
4. **Test Profile Upload**: Go to Profile page and upload image
5. **Verify Real-time Updates**: Check all components update immediately

### Database Management:
```bash
# View database in Prisma Studio
npx prisma studio

# Reset database (WARNING: Deletes all data)
npx prisma db push --accept-data-loss

# Check database connection
npx prisma db pull
```

## 🚨 **Troubleshooting Local Setup**

### Common Issues:

1. **PostgreSQL Not Running**:
   ```bash
   # Windows
   net start postgresql-x64-14
   
   # macOS
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   ```

2. **Connection Refused**:
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env file
   - Ensure database exists

3. **Permission Denied**:
   - Check user permissions
   - Verify database ownership
   - Update DATABASE_URL with correct credentials

4. **Port Already in Use**:
   ```bash
   # Change PORT in .env file
   PORT=4001
   ```

## 📊 **Local vs Production Configuration**

| Setting | Local Development | Production |
|---------|------------------|------------|
| Database | PostgreSQL (localhost) | PostgreSQL (Render) |
| URL | `postgresql://postgres:password@localhost:5432/cosypos_local` | `postgresql://cosypos_user:cosypos_password@dpg-d3qkenmmcj7s73bq3570-a:5432/cosypos` |
| Environment | `development` | `production` |
| Port | `4000` | `4000` |
| File Storage | `./uploads` | `./uploads` |

## ✅ **Verification Checklist**

After setup, verify these items:

- [ ] **PostgreSQL Running**: Database server is active
- [ ] **Database Created**: `cosypos_local` database exists
- [ ] **Environment File**: `.env` file with correct DATABASE_URL
- [ ] **Schema Applied**: `npx prisma db push` successful
- [ ] **Seed Data**: `node src/seed.js` successful
- [ ] **Server Starts**: `npm run dev` runs without errors
- [ ] **Profile Images**: Upload and real-time updates work
- [ ] **No SQLite**: `dev.db` file removed

## 🎉 **Success!**

Once all steps are completed, your local development environment will be using PostgreSQL, matching your production environment exactly.

### Quick Commands:
```bash
# Start local development
npm run dev

# Verify PostgreSQL setup
npm run verify:postgresql

# View database
npx prisma studio
```
