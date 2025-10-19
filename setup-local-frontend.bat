@echo off
echo Setting up local frontend development for CosyPOS...

REM Create frontend .env file to connect to production backend
echo VITE_API_URL=https://cosyposy-duplicate.onrender.com > frontend\.env
echo Frontend .env file created successfully!

echo.
echo Installing frontend dependencies...
cd frontend
call npm install

echo.
echo ========================================
echo LOCAL FRONTEND SETUP COMPLETE!
echo ========================================
echo.
echo Your local frontend will connect to the production backend.
echo This means:
echo   - All data operations use the PostgreSQL database
echo   - Profile image uploads work perfectly
echo   - All users and data are persistent
echo.
echo To start the frontend:
echo   cd frontend
echo   npm run dev
echo.
echo The application will be available at:
echo   Frontend: http://localhost:5173
echo   Backend:  https://cosyposy-duplicate.onrender.com
echo.
echo Default login credentials:
echo   Admin:    admin@cosypos.app / pass123
echo   Staff:    staff@cosypos.app / staff123
echo   Customer: customer@cosypos.app / customer123
echo.
echo Profile images will be saved to the PostgreSQL database
echo and will persist permanently!
echo.
pause
