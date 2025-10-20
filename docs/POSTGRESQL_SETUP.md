# PostgreSQL Database Setup Guide

## ✅ Current Configuration Status

The backend is **already configured for PostgreSQL** and ready for deployment.

### Database Configuration
- **Provider**: PostgreSQL (configured in `prisma/schema.prisma`)
- **Connection**: Uses `DATABASE_URL` environment variable
- **Production URL**: `postgresql://cosypos_user:cosypos_password@dpg-d3qkenmmcj7s73bq3570-a:5432/cosypos`

## 🚀 Deployment Configuration

### Render.com Backend Service Settings:
- **Service Type**: Web Service
- **Environment**: Node.js
- **Node Version**: 22.16.0
- **Root Directory**: `backend-deploy`
- **Build Command**: `npm install && npx prisma generate && npx prisma db push && node src/seed.js`
- **Start Command**: `npm run dev`

### Environment Variables (Production):
```bash
DATABASE_URL=postgresql://cosypos_user:cosypos_password@dpg-d3qkenmmcj7s73bq3570-a:5432/cosypos
JWT_SECRET=cosypos-super-secret-jwt-key-2024
NODE_ENV=production
PORT=4000
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

## 📊 Database Schema (PostgreSQL)

The schema includes all necessary tables for the application:

### Core Tables:
- **User** - User accounts with profile images
- **MenuCategory** - Food categories
- **MenuItem** - Individual menu items
- **InventoryItem** - Stock management
- **Table** - Restaurant tables
- **Order** - Customer orders
- **Reservation** - Table reservations
- **Attendance** - Staff attendance tracking
- **Payment** - Payment records
- **Notification** - System notifications

### Profile Image Support:
- **User.profileImage** - String field for profile image paths
- **File Storage** - Images stored in `/uploads/profiles/` directory
- **Real-time Updates** - Profile images update immediately across all components

## 🔄 Changes Reflection in Deployment

### How Changes Are Deployed:
1. **Code Changes**: Pushed to repository
2. **Auto-Deploy**: Render.com automatically detects changes
3. **Build Process**: Runs `npm install && npx prisma generate && npx prisma db push`
4. **Database Migration**: Prisma applies schema changes to PostgreSQL
5. **Seed Data**: Runs `node src/seed.js` to populate initial data
6. **Service Restart**: Application restarts with new changes

### Profile Image Changes:
- ✅ **Real-time Updates**: Profile images update immediately
- ✅ **Database Persistence**: Changes saved to PostgreSQL
- ✅ **File Storage**: Images stored in `/uploads/profiles/`
- ✅ **Cache Busting**: URLs include timestamps for fresh images
- ✅ **Error Handling**: Automatic rollback on upload failure

## 🛠️ Local Development Setup

### Prerequisites:
- Node.js 22.16.0+
- PostgreSQL database
- npm or yarn

### Setup Steps:
1. **Install Dependencies**:
   ```bash
   cd backend-deploy
   npm install
   ```

2. **Configure Environment**:
   ```bash
   # Create .env file with your PostgreSQL connection
   DATABASE_URL="postgresql://username:password@localhost:5432/cosypos"
   JWT_SECRET="your-secret-key"
   NODE_ENV="development"
   PORT=4000
   ```

3. **Setup Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   node src/seed.js
   ```

4. **Start Application**:
   ```bash
   npm run dev
   ```

## 🔍 Verification Steps

### Check PostgreSQL Connection:
```bash
# Test database connection
npx prisma db pull
```

### Verify Profile Image Functionality:
1. Login as admin
2. Go to Profile page
3. Upload new profile image
4. Verify image updates across all components
5. Check database for updated profileImage field

## 📝 Important Notes

- **No SQLite**: The system is completely PostgreSQL-based
- **Production Ready**: All configurations are set for production deployment
- **Auto-Deploy**: Changes automatically reflect in deployment
- **Data Persistence**: All data is stored in PostgreSQL database
- **File Storage**: Images are stored in the file system with database references

## 🚨 Troubleshooting

### Common Issues:
1. **Database Connection**: Check `DATABASE_URL` environment variable
2. **Migration Issues**: Run `npx prisma db push` to sync schema
3. **File Upload**: Ensure `/uploads` directory has write permissions
4. **CORS Issues**: Check CORS configuration in `src/index.js`

### Debug Commands:
```bash
# Check database connection
npx prisma db pull

# Reset database (WARNING: Deletes all data)
npx prisma db push --accept-data-loss

# View database in Prisma Studio
npx prisma studio
```
