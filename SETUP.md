# 🚀 CosyPOS Setup Guide

Complete step-by-step guide to set up CosyPOS on your local machine or server.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- ✅ **Node.js** v22.16.0 or higher ([Download](https://nodejs.org/))
- ✅ **npm** or **yarn** (comes with Node.js)
- ✅ **PostgreSQL** v14 or higher ([Download](https://www.postgresql.org/download/))
- ✅ **Git** ([Download](https://git-scm.com/downloads))

### Verify Installation

```bash
# Check Node.js version
node --version
# Should output: v22.16.0 or higher

# Check npm version
npm --version

# Check PostgreSQL version
psql --version
# Should output: psql (PostgreSQL) 14.x or higher

# Check Git version
git --version
```

---

## 🗄️ Database Setup

### 1. Create PostgreSQL Database

#### Using psql (Command Line):

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE cosypos;

# Create user (optional but recommended)
CREATE USER cosypos_user WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE cosypos TO cosypos_user;

# Exit psql
\q
```

#### Using pgAdmin (GUI):

1. Open pgAdmin
2. Right-click on "Databases" → "Create" → "Database..."
3. Name: `cosypos`
4. Owner: `postgres` (or your preferred user)
5. Click "Save"

### 2. Note Your Database Credentials

You'll need these for the `.env` file:
- **Host:** `localhost` (or your server IP)
- **Port:** `5432` (default PostgreSQL port)
- **Database:** `cosypos`
- **Username:** Your PostgreSQL username
- **Password:** Your PostgreSQL password

---

## 💻 Backend Setup

### 1. Navigate to Backend Directory

```bash
cd cosypos-clean/backend-deploy
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- Express.js (web framework)
- Prisma (ORM)
- JWT (authentication)
- bcryptjs (password hashing)
- Multer (file uploads)
- and more...

### 3. Create Environment File

Create a `.env` file in the `backend-deploy` directory:

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

If `.env.example` doesn't exist, create `.env` manually with:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/cosypos?schema=public"

# JWT Secret (Change this!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server Configuration
PORT=4000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:5173"
```

**⚠️ Important:** Replace the database credentials:
```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/cosypos?schema=public"
```

Example:
```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/cosypos?schema=public"
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

This generates the Prisma Client based on your schema.

### 5. Push Database Schema

```bash
npx prisma db push
```

This creates all tables in your database according to the Prisma schema.

### 6. Seed the Database

```bash
npm run seed
```

This populates your database with initial data:
- Default admin account
- Sample menu items
- Sample categories
- Test users

**Default Accounts Created:**
- Admin: `admin@cosypos.app` / `pass123`
- Staff: `staff@cosypos.app` / `staff123`
- Customer: `customer@cosypos.app` / `customer123`

### 7. Start Backend Server

```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:4000
✅ Database connected successfully
```

**Verify Backend is Running:**

Open your browser and visit:
- `http://localhost:4000/api/health` - Should show "OK"
- `http://localhost:4000/api/menu` - Should return menu items

---

## 🎨 Frontend Setup

### 1. Open New Terminal

Keep the backend terminal running and open a **new terminal window**.

### 2. Navigate to Frontend Directory

```bash
cd cosypos-clean/frontend-deploy
```

### 3. Install Dependencies

```bash
npm install
```

This will install:
- React 19
- React Router
- Vite
- and more...

### 4. Create Environment File

Create a `.env` file in the `frontend-deploy` directory:

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Or create `.env` manually with:

```env
# Backend API URL
VITE_API_URL=http://localhost:4000
```

**Note:** For production, change this to your deployed backend URL:
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

### 5. Start Frontend Dev Server

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 6. Open Application

Open your browser and navigate to:
```
http://localhost:5173
```

You should see the CosyPOS login page! 🎉

---

## 🔐 First Login

1. Go to `http://localhost:5173`
2. Log in with default credentials:
   - **Email:** `admin@cosypos.app`
   - **Password:** `pass123`
3. You should be redirected to the Dashboard

**⚠️ Security Note:** Change the default admin password after first login!

---

## ✅ Verify Everything Works

### Backend Health Check

```bash
curl http://localhost:4000/api/health
```

Should return: `{"status":"ok"}`

### Database Connection

```bash
# In backend-deploy directory
npx prisma studio
```

This opens Prisma Studio at `http://localhost:5555` where you can view/edit database records.

### Frontend Test

1. Navigate through different pages (Dashboard, Menu, Orders, etc.)
2. Try creating a new menu item
3. Try placing an order
4. Check if images load correctly

---

## 🐛 Troubleshooting

### Backend Issues

#### Error: "Cannot connect to database"

**Solution:**
1. Verify PostgreSQL is running:
   ```bash
   # Windows
   services.msc
   # Look for "postgresql-x64-xx"
   
   # Mac
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Check DATABASE_URL in `.env`
3. Test connection:
   ```bash
   psql -U postgres -d cosypos
   ```

#### Error: "Port 4000 already in use"

**Solution:**
1. Find and kill the process:
   ```bash
   # Windows
   netstat -ano | findstr :4000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -i :4000
   kill -9 <PID>
   ```

2. Or change the PORT in `.env`:
   ```env
   PORT=4001
   ```

#### Error: "Prisma Client is not generated"

**Solution:**
```bash
npx prisma generate
```

### Frontend Issues

#### Error: "Network Error" when fetching data

**Solution:**
1. Verify backend is running on `http://localhost:4000`
2. Check `VITE_API_URL` in frontend `.env`
3. Check browser console for CORS errors

#### Error: "Port 5173 already in use"

**Solution:**
1. Change the port in `vite.config.js`:
   ```javascript
   export default defineConfig({
     server: {
       port: 5174
     }
   })
   ```

#### Blank page or "Cannot GET /"

**Solution:**
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check browser console for errors

### Database Issues

#### Error: "relation does not exist"

**Solution:**
```bash
# Reset and recreate database
npx prisma db push --force-reset
npm run seed
```

#### Error: "Schema changes without migration"

**Solution:**
```bash
npx prisma generate
npx prisma db push
```

---

## 🔄 Reset Everything

If you want to start fresh:

```bash
# Stop all servers (Ctrl+C in terminals)

# Backend cleanup
cd backend-deploy
rm -rf node_modules
rm -rf prisma/dev.db (if using SQLite)
npm install
npx prisma db push --force-reset
npm run seed

# Frontend cleanup
cd ../frontend-deploy
rm -rf node_modules
rm -rf dist
npm install
```

---

## 🚀 Production Deployment

See [README.md](README.md#-deployment) for detailed deployment instructions for:
- Render.com
- Vercel
- Heroku
- AWS
- DigitalOcean

---

## 📚 Next Steps

1. ✅ **Change default passwords** (especially admin!)
2. 📖 **Read the documentation** in the `docs/` folder
3. 🎨 **Customize the theme** in `frontend-deploy/src/styles/`
4. 🔧 **Configure settings** in `.env` files
5. 📊 **Add your menu items** and categories
6. 👥 **Create staff accounts** with appropriate roles
7. 🎉 **Start using CosyPOS!**

---

## 🆘 Need Help?

- 📖 **Documentation:** [README.md](README.md)
- 🐛 **Issues:** [GitHub Issues](https://github.com/yourusername/cosypos/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/yourusername/cosypos/discussions)
- 📧 **Contact:** support@cosypos.com

---

## 🎉 You're All Set!

Congratulations! Your CosyPOS installation is complete. Happy restaurant managing! 🍔🍕🍰

For advanced configuration and features, check out the [README.md](README.md) and documentation in the `docs/` folder.

---

**Made with ❤️ by the CosyPOS Team**


