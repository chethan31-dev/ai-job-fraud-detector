# How to Push Code to GitHub

## Prerequisites
- Git installed on your system
- GitHub account access
- Repository: https://github.com/chethan31-dev/ai-job-fraud-detector

## Step-by-Step Instructions

### Step 1: Initialize Git Repository
Open your terminal in the project directory and run:

```bash
git init
```

### Step 2: Add Remote Repository
```bash
git remote add origin https://github.com/chethan31-dev/ai-job-fraud-detector.git
```

### Step 3: Add All Files
```bash
git add .
```

### Step 4: Commit Changes
```bash
git commit -m "Initial commit: AI-Powered Fake Job Detection System"
```

### Step 5: Push to GitHub
```bash
git branch -M main
git push -u origin main
```

## If Repository Already Has Content

If the repository already has files, you may need to force push or pull first:

### Option A: Pull and Merge
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Option B: Force Push (⚠️ This will overwrite remote content)
```bash
git push -u origin main --force
```

## Authentication

When prompted for credentials:
- **Username:** Your GitHub username
- **Password:** Use a Personal Access Token (not your GitHub password)

### How to Create Personal Access Token:
1. Go to GitHub.com → Settings → Developer settings
2. Click "Personal access tokens" → "Tokens (classic)"
3. Click "Generate new token"
4. Select scopes: `repo` (full control)
5. Copy the token and use it as password

## Alternative: Using GitHub CLI

If you have GitHub CLI installed:

```bash
gh auth login
gh repo clone chethan31-dev/ai-job-fraud-detector temp
cp -r temp/.git .
rm -rf temp
git add .
git commit -m "Initial commit: AI-Powered Fake Job Detection System"
git push
```

## Quick Copy-Paste Commands

```bash
# Initialize and push
git init
git remote add origin https://github.com/chethan31-dev/ai-job-fraud-detector.git
git add .
git commit -m "Initial commit: AI-Powered Fake Job Detection System"
git branch -M main
git push -u origin main
```

## Verify Push

After pushing, visit:
https://github.com/chethan31-dev/ai-job-fraud-detector

You should see all your files there!

## Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/chethan31-dev/ai-job-fraud-detector.git
```

### Error: "failed to push some refs"
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Error: "Authentication failed"
- Make sure you're using a Personal Access Token, not your password
- Check if your token has `repo` permissions

## What Gets Pushed

✅ All source code (client/ and server/)
✅ Configuration files (package.json, .env.example)
✅ README.md
✅ .gitignore

❌ node_modules/ (excluded by .gitignore)
❌ .env (excluded by .gitignore)
❌ uploads/* (excluded by .gitignore)

## After Pushing

Remember to:
1. Add a good README.md description
2. Set up GitHub Actions (optional)
3. Add topics/tags to your repository
4. Make repository public/private as needed
