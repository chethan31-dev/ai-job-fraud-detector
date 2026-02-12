@echo off
echo ========================================
echo  Pushing to GitHub Repository
echo ========================================
echo.

echo Step 1: Initializing Git...
git init

echo.
echo Step 2: Adding remote repository...
git remote add origin https://github.com/chethan31-dev/ai-job-fraud-detector.git

echo.
echo Step 3: Adding all files...
git add .

echo.
echo Step 4: Committing changes...
git commit -m "Initial commit: AI-Powered Fake Job Detection System"

echo.
echo Step 5: Setting main branch...
git branch -M main

echo.
echo Step 6: Pushing to GitHub...
echo You will be prompted for your GitHub credentials:
echo - Username: Your GitHub username
echo - Password: Use Personal Access Token (not password)
echo.
git push -u origin main

echo.
echo ========================================
echo  Push Complete!
echo ========================================
echo.
echo Visit: https://github.com/chethan31-dev/ai-job-fraud-detector
echo.
pause
