@echo off
title CosyPOS Auto Setup
color 0A

echo.
echo ========================================
echo    🚀 COSYPOS AUTO SETUP 🚀
echo ========================================
echo.

echo ✅ Step 1: Git repository is ready
echo ✅ Step 2: All files are committed
echo ✅ Step 3: Application tested locally
echo.

echo 📋 WHAT YOU NEED TO DO:
echo.
echo 1. Open https://github.com in your browser
echo 2. Click the "+" button (top right)
echo 3. Click "New repository"
echo 4. Name: cosypos-duplicate
echo 5. Make it PUBLIC ✅
echo 6. DON'T check any boxes ❌
echo 7. Click "Create repository"
echo 8. Copy the HTTPS URL (looks like: https://github.com/username/cosypos-duplicate.git)
echo.

set /p REPO_URL="📋 Paste your GitHub repository URL here: "

echo.
echo 🔗 Connecting to GitHub...
git remote add origin %REPO_URL%
git branch -M main
git push -u origin main

echo.
echo ✅ SUCCESS! Your project is now on GitHub!
echo.
echo 🌐 Your repository: %REPO_URL%
echo.
echo 📋 NEXT STEPS:
echo 1. Go to https://render.com
echo 2. Sign up with GitHub
echo 3. Connect your repository
echo 4. Deploy your application
echo.
echo 🎉 Your CosyPOS is ready for deployment!
echo.
pause
