@echo off
echo Setting up local PostgreSQL database for CosyPOS...

echo.
echo ========================================
echo INSTALLING POSTGRESQL LOCALLY
echo ========================================
echo.
echo This will install PostgreSQL on your local machine.
echo You will need to download and install PostgreSQL.
echo.
echo Steps:
echo 1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
echo 2. Install with default settings
echo 3. Remember the password you set for 'postgres' user
echo 4. Run this script again after installation
echo.
echo Press any key to continue after installing PostgreSQL...
pause

echo.
echo ========================================
echo CONFIGURING LOCAL DATABASE
echo ========================================

REM Create .env file for local PostgreSQL
echo # Local PostgreSQL Database Configuration > .env
echo DATABASE_URL=postgresql://postgres:password@localhost:5432/cosypos_local >> .env
echo JWT_SECRET=cosypos-super-secret-jwt-key-2024 >> .env
echo NODE_ENV=development >> .env
echo PORT=4000 >> .env
echo MAX_FILE_SIZE=10485760 >> .env
echo UPLOAD_PATH=./uploads >> .env
echo. >> .env
echo # CORS Configuration >> .env
echo CORS_ORIGIN=http://localhost:5173,http://localhost:5174 >> .env

echo.
echo .env file created successfully!

REM Create frontend .env file
echo VITE_API_URL=http://localhost:4000 > frontend\.env
echo Frontend .env file created successfully!

echo.
echo ========================================
echo SETTING UP DATABASE
echo ========================================

echo Installing dependencies...
call npm install

echo.
echo Generating Prisma client...
call npx prisma generate

echo.
echo Creating local database...
echo Please enter your PostgreSQL password when prompted:
call createdb -U postgres cosypos_local

echo.
echo Pushing database schema...
call npx prisma db push

echo.
echo Seeding database with default users...
call node src/seed.js

echo.
echo ========================================
echo LOCAL POSTGRESQL SETUP COMPLETE!
echo ========================================
echo.
echo To start the backend:
echo   npm run dev
echo.
echo To start the frontend:
echo   cd frontend
echo   npm run dev
echo.
echo The application will be available at:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:4000
echo.
echo Database: Local PostgreSQL (cosypos_local)
echo Profile images will be saved locally and persist!
echo.
echo Default login credentials:
echo   Admin:    admin@cosypos.app / pass123
echo   Staff:    staff@cosypos.app / staff123
echo   Customer: customer@cosypos.app / customer123
echo.
echo ========================================
echo IMPORTANT NOTES:
echo ========================================
echo 1. Make sure PostgreSQL service is running
echo 2. If you get connection errors, check PostgreSQL is installed
echo 3. Update the password in .env file if different from 'password'
echo 4. Your profile images will be saved locally in uploads/profiles/
echo 5. All data will persist in your local PostgreSQL database
echo.
pause
