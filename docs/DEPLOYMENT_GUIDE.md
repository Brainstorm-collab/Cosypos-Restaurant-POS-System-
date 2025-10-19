# 🚀 CosyPOS Deployment Guide

This guide provides step-by-step instructions for deploying CosyPOS to Render.com.

## 📋 Prerequisites

- [Render.com account](https://render.com)
- [GitHub repository](https://github.com/Brainstorm-collab/cosyposy-duplicate) connected to Render
- PostgreSQL database (provided by Render)

## 🗄️ Step 1: Create PostgreSQL Database

1. **Login to Render Dashboard**
2. **Click "New +" → "PostgreSQL"**
3. **Configure Database:**
   - **Name:** `cosypos-db`
   - **Database:** `cosypos`
   - **User:** `cosypos_user`
   - **Password:** `cosypos_password` (or generate secure password)
   - **Region:** Choose closest to your users
4. **Click "Create Database"**
5. **Copy the External Database URL** (you'll need this for backend)

## 🔧 Step 2: Deploy Backend Service

1. **Click "New +" → "Web Service"**
2. **Connect Repository:** Select `cosyposy-duplicate`
3. **Configure Service:**
   - **Name:** `cosypos-backend`
   - **Root Directory:** `backend-deploy`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npx prisma generate && npx prisma db push && node src/seed.js`
   - **Start Command:** `npm run dev`
   - **Node Version:** `22.16.0`

4. **Add Environment Variables:**
   ```
   DATABASE_URL=postgresql://cosypos_user:cosypos_password@dpg-d3qkenmmcj7s73bq3570-a:5432/cosypos
   JWT_SECRET=cosypos-super-secret-jwt-key-2024
   NODE_ENV=production
   PORT=4000
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   ```

5. **Click "Create Web Service"**

## 🎨 Step 3: Deploy Frontend Service

1. **Click "New +" → "Static Site"**
2. **Connect Repository:** Select `cosyposy-duplicate`
3. **Configure Service:**
   - **Name:** `cosypos-frontend`
   - **Root Directory:** `frontend-deploy`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Node Version:** `22.16.0`

4. **Add Environment Variables:**
   ```
   VITE_API_URL=https://cosypos-backend.onrender.com
   ```

5. **Click "Create Static Site"**

## 🔄 Step 4: Configure Auto-Deploy

For both services:
1. **Go to Service Settings**
2. **Enable "Auto-Deploy"**
3. **Set Branch:** `main`
4. **Save Settings**

## ✅ Step 5: Verify Deployment

1. **Wait for both services to deploy** (5-10 minutes)
2. **Test Backend:** Visit `https://cosypos-backend.onrender.com/api/health`
3. **Test Frontend:** Visit `https://cosypos-frontend.onrender.com`
4. **Test Login:** Use default credentials

## 🔐 Default User Credentials

- **Admin:** `admin@cosypos.app` / `pass123`
- **Staff:** `staff@cosypos.app` / `staff123`
- **Customer:** `customer@cosypos.app` / `customer123`

## 🛠️ Troubleshooting

### Backend Issues:
- **Database Connection:** Verify DATABASE_URL is correct
- **Prisma Issues:** Check if `npx prisma generate` runs successfully
- **Build Failures:** Check Node.js version (must be 22.16.0)

### Frontend Issues:
- **API Connection:** Verify VITE_API_URL points to correct backend
- **Build Failures:** Check if all dependencies are installed
- **CORS Issues:** Backend CORS is configured to allow all origins

### Common Solutions:
1. **Redeploy Services** if changes don't appear
2. **Check Logs** in Render dashboard for error details
3. **Verify Environment Variables** are set correctly
4. **Ensure Database is Running** and accessible

## 📊 Monitoring

- **Health Check:** `/api/health` endpoint
- **Database Status:** Check PostgreSQL service status
- **Logs:** Available in Render dashboard for both services

## 🔄 Updates

To update the application:
1. **Push changes to GitHub**
2. **Render will auto-deploy** (if enabled)
3. **Monitor deployment** in Render dashboard
4. **Test functionality** after deployment

## 🎯 Performance Tips

- **Database Connection Pooling:** Configured in Prisma
- **File Upload Limits:** Set to 10MB maximum
- **Caching:** Static assets cached for 1 day
- **Compression:** Enabled for API responses

## 📞 Support

If you encounter issues:
1. **Check Render logs** for detailed error messages
2. **Verify environment variables** are correctly set
3. **Test database connectivity** from backend service
4. **Contact development team** with specific error details
