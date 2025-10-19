@echo off
echo Setting up local environment with SQLite for CosyPOS...

REM Create .env file for local development with SQLite
echo # Database Configuration > .env
echo DATABASE_URL="file:./dev.db" >> .env
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

REM Create local SQLite schema
echo Creating local SQLite schema...
copy prisma\schema.prisma prisma\schema.local.prisma

REM Update schema for SQLite
powershell -Command "(Get-Content prisma\schema.local.prisma) -replace 'provider = \"postgresql\"', 'provider = \"sqlite\"' | Set-Content prisma\schema.local.prisma"
powershell -Command "(Get-Content prisma\schema.local.prisma) -replace 'url      = env(\"DATABASE_URL\")', 'url      = \"file:./dev.db\"' | Set-Content prisma\schema.local.prisma"

echo.
echo Installing dependencies...
call npm install

echo.
echo Generating Prisma client for SQLite...
call npx prisma generate --schema=prisma/schema.local.prisma

echo.
echo Creating SQLite database...
call npx prisma db push --schema=prisma/schema.local.prisma

echo.
echo Running seed script...
call node src/seed.js

echo.
echo ========================================
echo LOCAL SQLITE SETUP COMPLETE!
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
echo Database: SQLite (local file: dev.db)
echo Profile images will be saved locally in uploads/profiles/
echo.
pause
