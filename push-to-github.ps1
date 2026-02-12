# Push to GitHub Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Pushing to GitHub Repository" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Initializing Git..." -ForegroundColor Yellow
git init

Write-Host ""
Write-Host "Step 2: Adding remote repository..." -ForegroundColor Yellow
git remote add origin https://github.com/chethan31-dev/ai-job-fraud-detector.git

Write-Host ""
Write-Host "Step 3: Adding all files..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "Step 4: Committing changes..." -ForegroundColor Yellow
git commit -m "Initial commit: AI-Powered Fake Job Detection System"

Write-Host ""
Write-Host "Step 5: Setting main branch..." -ForegroundColor Yellow
git branch -M main

Write-Host ""
Write-Host "Step 6: Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "You will be prompted for your GitHub credentials:" -ForegroundColor Green
Write-Host "- Username: Your GitHub username" -ForegroundColor Green
Write-Host "- Password: Use Personal Access Token (not password)" -ForegroundColor Green
Write-Host ""
git push -u origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Push Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Visit: https://github.com/chethan31-dev/ai-job-fraud-detector" -ForegroundColor Blue
Write-Host ""
Read-Host "Press Enter to exit"
