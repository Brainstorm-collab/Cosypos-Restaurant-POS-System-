@echo off
echo Setting up PostgreSQL with Docker for CosyPOS...

echo.
echo ========================================
echo CHECKING DOCKER INSTALLATION
echo ========================================
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not installed or not running.
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    echo Then run this script again.
    pause
    exit /b 1
)

echo Docker is installed and running!

echo.
echo ========================================
echo STARTING POSTGRESQL CONTAINER
echo ========================================

echo Starting PostgreSQL container...
docker-compose up -d postgres

echo.
echo Waiting for PostgreSQL to be ready...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo CONFIGURING APPLICATION
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
echo Installing dependencies...
call npm install

echo.
echo Generating Prisma client...
call npx prisma generate

echo.
echo Pushing database schema...
call npx prisma db push

echo.
echo Seeding database with default users...
call node src/seed.js

echo.
echo ========================================
echo DOCKER POSTGRESQL SETUP COMPLETE!
echo ========================================
echo.
echo PostgreSQL is running in Docker container.
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
echo   PostgreSQL: localhost:5432
echo.
echo Database: Local PostgreSQL (cosypos_local) in Docker
echo Profile images will be saved locally and persist!
echo.
echo Default login credentials:
echo   Admin:    admin@cosypos.app / pass123
echo   Staff:    staff@cosypos.app / staff123
echo   Customer: customer@cosypos.app / customer123
echo.
echo To stop PostgreSQL:
echo   docker-compose down
echo.
echo To start PostgreSQL again:
echo   docker-compose up -d postgres
echo.
pause
