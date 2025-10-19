@echo off
echo ========================================
echo CosyPOS Local Development Setup
echo ========================================
echo.

echo Setting up local environment...
echo.

REM Create backend .env file
echo DATABASE_URL=postgresql://cosypos_user:cosypos_password@dpg-d3qkenmmcj7s73bq3570-a:5432/cosypos > backend-deploy\.env
echo JWT_SECRET=cosypos-super-secret-jwt-key-2024 >> backend-deploy\.env
echo NODE_ENV=development >> backend-deploy\.env
echo PORT=4000 >> backend-deploy\.env
echo MAX_FILE_SIZE=10485760 >> backend-deploy\.env
echo UPLOAD_PATH=./uploads >> backend-deploy\.env

echo Backend .env created successfully!

REM Create frontend .env file
echo VITE_API_URL=http://localhost:4000 > frontend-deploy\.env
echo Frontend .env created successfully!

echo.
echo Installing dependencies...
call npm run install:all

echo.
echo Setting up database...
call npm run db:setup

echo.
echo ========================================
echo LOCAL SETUP COMPLETE!
echo ========================================

echo To start development:
echo   npm run dev
echo.
echo The application will be available at:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:4000
echo.
echo Default login credentials:
echo   Admin:    admin@cosypos.app / pass123
echo   Staff:    staff@cosypos.app / staff123
echo   Customer: customer@cosypos.app / customer123
echo.
pause
