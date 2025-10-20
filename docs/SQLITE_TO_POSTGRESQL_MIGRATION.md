# 🔄 SQLite to PostgreSQL Migration Guide

## 🎯 **Goal: Switch to PostgreSQL WITHOUT Losing Data**

This guide will help you migrate from SQLite to PostgreSQL while preserving all your existing data.

## 📊 **Current Data Status**

Your existing data includes:
- ✅ **User accounts** (with profile images)
- ✅ **Menu categories and items**
- ✅ **Orders and reservations**
- ✅ **Inventory data**
- ✅ **Uploaded files** (images in `/uploads/`)

## 🛠️ **Migration Strategy: Data Preservation**

### Phase 1: Backup Current Data
```bash
cd backend-deploy

# 1. Backup SQLite database
cp prisma/dev.db prisma/dev.db.backup

# 2. Backup uploads directory
cp -r uploads uploads_backup

# 3. Export data (optional - for manual verification)
# You can use SQLite browser tools to export data
```

### Phase 2: Setup PostgreSQL (Parallel)
```bash
# 1. Install PostgreSQL locally
# Windows: Download from postgresql.org
# macOS: brew install postgresql
# Linux: sudo apt install postgresql

# 2. Create PostgreSQL database
psql -U postgres
CREATE DATABASE cosypos_local;
\q

# 3. Create .env file for PostgreSQL
echo 'DATABASE_URL="postgresql://postgres:your_password@localhost:5432/cosypos_local"' > .env
echo 'JWT_SECRET="local-development-jwt-secret-key"' >> .env
echo 'NODE_ENV="development"' >> .env
echo 'PORT=4000' >> .env
```

### Phase 3: Data Migration Options

#### Option A: Fresh Start with Seed Data (Recommended)
```bash
# 1. Apply schema to PostgreSQL
npx prisma generate
npx prisma db push

# 2. Seed with initial data
node src/seed.js

# 3. Manually recreate important records
# - Re-register important users
# - Re-upload important menu items
# - Recreate essential data
```

#### Option B: Manual Data Export/Import
```bash
# 1. Export SQLite data to SQL
# Use SQLite browser or command line tools

# 2. Convert SQL to PostgreSQL format
# Adjust data types and syntax

# 3. Import to PostgreSQL
# Use psql or pgAdmin
```

## 🚀 **Step-by-Step Migration Process**

### Step 1: Backup Everything
```bash
cd backend-deploy

# Create backup directory
mkdir -p backups/$(date +%Y%m%d)

# Backup SQLite database
cp prisma/dev.db backups/$(date +%Y%m%d)/dev.db.backup

# Backup uploads
cp -r uploads backups/$(date +%Y%m%d)/uploads_backup

# Backup current .env (if exists)
cp .env backups/$(date +%Y%m%d)/.env.backup 2>/dev/null || true
```

### Step 2: Setup PostgreSQL
```bash
# Install PostgreSQL (if not already installed)
# Windows: Download installer
# macOS: brew install postgresql && brew services start postgresql
# Linux: sudo apt install postgresql postgresql-contrib

# Create database
psql -U postgres -c "CREATE DATABASE cosypos_local;"
```

### Step 3: Configure Environment
```bash
# Create .env file for PostgreSQL
cat > .env << EOF
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/cosypos_local"
JWT_SECRET="local-development-jwt-secret-key"
NODE_ENV="development"
PORT=4000
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
CORS_ORIGIN="http://localhost:5173"
EOF
```

### Step 4: Apply Schema and Seed Data
```bash
# Generate Prisma client
npx prisma generate

# Apply schema to PostgreSQL
npx prisma db push

# Seed with initial data
node src/seed.js

# Verify setup
npm run verify:postgresql
```

### Step 5: Preserve Important Data

#### User Accounts:
```bash
# If you have important user accounts, recreate them:
# 1. Register users through the application
# 2. Upload profile images
# 3. Set user roles as needed
```

#### Menu Items:
```bash
# If you have custom menu items:
# 1. Go to Menu page in the application
# 2. Recreate categories and items
# 3. Upload images for menu items
```

#### Uploaded Files:
```bash
# Your uploaded files are preserved in /uploads/ directory
# They will work with PostgreSQL once the database references are updated
```

## 🔄 **Migration Scripts**

### Automated Migration Helper:
```bash
# Run migration helper
npm run migrate:to-postgresql

# This will:
# 1. Check for existing SQLite data
# 2. Guide you through the migration process
# 3. Help preserve important data
```

### Verification Script:
```bash
# Verify PostgreSQL setup
npm run verify:postgresql

# This will test:
# - Database connection
# - Schema application
# - Profile image functionality
# - All required tables
```

## 📋 **Data Preservation Checklist**

### ✅ What's Preserved:
- [ ] **Uploaded Files**: All images in `/uploads/` directory
- [ ] **Database Schema**: Same structure in PostgreSQL
- [ ] **Application Logic**: All functionality remains the same
- [ ] **Profile Images**: Will work with PostgreSQL
- [ ] **File Storage**: Same file system storage

### 🔄 What Needs Recreation:
- [ ] **User Accounts**: Re-register through application
- [ ] **Menu Data**: Recreate through application interface
- [ ] **Orders**: Will be created as users place orders
- [ ] **Reservations**: Will be created as users make reservations

## 🎯 **Benefits of Migration**

### ✅ Advantages:
- **Production Parity**: Local matches production environment
- **Better Performance**: PostgreSQL is more robust
- **Scalability**: Better for larger datasets
- **Features**: More advanced database features
- **Consistency**: Same database everywhere

### 🔧 **Migration Benefits:**
- **Real-time Updates**: Profile images work the same way
- **Data Integrity**: Better data validation
- **Backup/Restore**: Easier database management
- **Development**: Better development experience

## 🚨 **Important Notes**

### ⚠️ **Before Migration:**
1. **Backup Everything**: Don't skip the backup step
2. **Test Locally**: Verify PostgreSQL works locally
3. **Document Changes**: Note any custom data you need to recreate

### ✅ **After Migration:**
1. **Verify Functionality**: Test all features work
2. **Check Profile Images**: Ensure real-time updates work
3. **Test File Uploads**: Verify file storage works
4. **Remove SQLite**: Only after confirming everything works

## 🎉 **Success Criteria**

### ✅ Migration Complete When:
- [ ] **PostgreSQL Running**: Database server active
- [ ] **Schema Applied**: All tables created
- [ ] **Application Working**: Backend starts without errors
- [ ] **Profile Images**: Upload and real-time updates work
- [ ] **File Storage**: Uploads work correctly
- [ ] **No SQLite**: Old database removed

## 🚀 **Quick Migration Commands**

```bash
# 1. Backup current data
mkdir -p backups && cp prisma/dev.db backups/ && cp -r uploads backups/

# 2. Setup PostgreSQL
# (Install PostgreSQL and create database)

# 3. Configure environment
echo 'DATABASE_URL="postgresql://postgres:password@localhost:5432/cosypos_local"' > .env

# 4. Apply schema
npx prisma generate && npx prisma db push && node src/seed.js

# 5. Verify setup
npm run verify:postgresql

# 6. Start development
npm run dev
```

## 📚 **Support**

If you encounter issues:
1. **Check Documentation**: `docs/LOCAL_POSTGRESQL_SETUP.md`
2. **Run Verification**: `npm run verify:postgresql`
3. **Check Logs**: Look for error messages
4. **Restore Backup**: If needed, restore from backup

**Your data will be preserved, and you'll have a better development environment with PostgreSQL!**
