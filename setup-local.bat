@echo off
echo Setting up local environment for CosyPOS...

REM Create .env file for local development
echo # Database Configuration > .env
echo DATABASE_URL=postgresql://cosypos_user:cosypos_password@dpg-d3qkenmmcj7s73bq3570-a:5432/cosypos >> .env
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
echo Running seed script...
call node src/seed.js

echo.
echo ========================================
echo LOCAL SETUP COMPLETE!
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
echo Default login credentials:
echo   Admin:    admin@cosypos.app / pass123
echo   Staff:    staff@cosypos.app / staff123
echo   Customer: customer@cosypos.app / customer123
echo.
pause
