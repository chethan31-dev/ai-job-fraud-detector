# 🚀 Deployment Fix Guide - Vercel + Render

## 🔍 Problem Explanation

### Why 405 Error Happened

**The Issue:**
```javascript
// ❌ WRONG - Relative path
axios.post('/api/auth/login', ...)
```

When deployed on Vercel, this becomes:
```
https://ai-job-fraud-detector.vercel.app/api/auth/login
```

Vercel doesn't have this API route, so it serves `index.html` (SPA fallback), causing **405 Method Not Allowed**.

**The Solution:**
```javascript
// ✅ CORRECT - Full backend URL
axios.post('https://ai-job-fraud-detector.onrender.com/api/auth/login', ...)
```

---

## ✅ Complete Fix Applied

### 1. Fixed `client/src/services/api.js`

**Before:**
```javascript
const api = axios.create({
  baseURL: "https://ai-job-fraud-detector.onrender.com/api", // Hardcoded
});

// Relative paths
api.post("/analyze-job", ...)
```

**After:**
```javascript
// Use environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Full paths with /api prefix
api.post("/api/analyze-job", ...)
```

### 2. Fixed `client/src/context/AuthContext.js`

**Before:**
```javascript
// ❌ Relative paths
axios.post('/api/auth/login', ...)
axios.post('/api/auth/register', ...)
axios.get('/api/auth/me')
```

**After:**
```javascript
// ✅ Full URLs using environment variable
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.post(`${API_URL}/api/auth/login`, ...)
axios.post(`${API_URL}/api/auth/register`, ...)
axios.get(`${API_URL}/api/auth/me`)
```

### 3. Fixed Backend CORS (`server/server.js`)

**Before:**
```javascript
app.use(cors()); // Allows all origins
```

**After:**
```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://ai-job-fraud-detector.vercel.app', 'https://ai-job-fraud-detector-*.vercel.app']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

---

## 🔧 Vercel Configuration

### Step 1: Set Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add new variable:

```
Name:  REACT_APP_API_URL
Value: https://ai-job-fraud-detector.onrender.com
```

4. Select environments: **Production**, **Preview**, **Development**
5. Click **Save**

### Step 2: Redeploy

**Yes, you MUST redeploy after setting environment variables!**

Option A: Automatic (Recommended)
```bash
git add .
git commit -m "Fix API URL configuration"
git push origin main
```

Option B: Manual
- Go to Vercel Dashboard → Deployments
- Click "Redeploy" on latest deployment

---

## 🔧 Render Configuration

### Set Environment Variables

1. Go to Render Dashboard → Your Service
2. Click **Environment** tab
3. Add these variables:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_strong_secret_key
PORT=5000
```

4. Click **Save Changes**
5. Render will auto-redeploy

---

## 📋 Deployment Checklist

### Frontend (Vercel)

- [x] Fixed `api.js` to use environment variable
- [x] Fixed `AuthContext.js` to use full URLs
- [x] Set `REACT_APP_API_URL` in Vercel
- [ ] Commit and push changes
- [ ] Verify deployment completes
- [ ] Test login at https://ai-job-fraud-detector.vercel.app

### Backend (Render)

- [x] Fixed CORS configuration
- [x] Added proper origin whitelist
- [ ] Set environment variables in Render
- [ ] Verify deployment completes
- [ ] Test API at https://ai-job-fraud-detector.onrender.com/api/health

---

## 🧪 Testing After Deployment

### 1. Test Backend API Directly

```bash
# Health check
curl https://ai-job-fraud-detector.onrender.com/api/health

# Should return: {"status":"OK","message":"..."}
```

### 2. Test Frontend Login

1. Go to https://ai-job-fraud-detector.vercel.app
2. Open DevTools (F12) → Network tab
3. Try to login
4. Check the request URL should be:
   ```
   https://ai-job-fraud-detector.onrender.com/api/auth/login
   ```
   NOT
   ```
   https://ai-job-fraud-detector.vercel.app/api/auth/login
   ```

### 3. Check CORS Headers

In Network tab, check response headers:
```
access-control-allow-origin: https://ai-job-fraud-detector.vercel.app
access-control-allow-credentials: true
```

---

## 🔍 Troubleshooting

### Issue: Still getting 405 error

**Check:**
1. Did you set `REACT_APP_API_URL` in Vercel?
2. Did you redeploy after setting the variable?
3. Clear browser cache (Ctrl+Shift+R)

**Verify:**
```javascript
// In browser console
console.log(process.env.REACT_APP_API_URL)
// Should show: https://ai-job-fraud-detector.onrender.com
```

### Issue: CORS error

**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Fix:**
1. Check backend CORS configuration includes your Vercel URL
2. Verify `NODE_ENV=production` is set in Render
3. Redeploy backend

### Issue: Backend not responding

**Check:**
1. Render service is running (not sleeping)
2. MongoDB connection is working
3. Environment variables are set correctly

**Test:**
```bash
curl https://ai-job-fraud-detector.onrender.com/api/health
```

### Issue: Environment variable not working

**Remember:**
- Environment variables starting with `REACT_APP_` are embedded at BUILD time
- You MUST redeploy after changing them
- They won't update on existing deployments

---

## 📝 Final Configuration Summary

### Frontend Environment Variables (Vercel)

```env
REACT_APP_API_URL=https://ai-job-fraud-detector.onrender.com
```

### Backend Environment Variables (Render)

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_key_min_32_characters
USE_MOCK_AI=false
OPENAI_API_KEY=your_openai_key (optional)
AZURE_VISION_ENDPOINT=your_endpoint (optional)
AZURE_VISION_KEY=your_key (optional)
```

---

## ✅ Expected Behavior After Fix

### Login Flow:

1. User enters credentials on Vercel frontend
2. Frontend makes request to:
   ```
   POST https://ai-job-fraud-detector.onrender.com/api/auth/login
   ```
3. Render backend processes request
4. Returns JWT token
5. Frontend stores token and redirects to dashboard

### Network Tab Should Show:

```
Request URL: https://ai-job-fraud-detector.onrender.com/api/auth/login
Request Method: POST
Status Code: 200 OK
Response Headers:
  access-control-allow-origin: https://ai-job-fraud-detector.vercel.app
  content-type: application/json
```

---

## 🚀 Deployment Commands

### Push Changes to GitHub

```bash
# Add all changes
git add .

# Commit
git commit -m "Fix: Configure API URL for production deployment"

# Push to GitHub
git push origin main
```

### Vercel will auto-deploy from GitHub
### Render will auto-deploy from GitHub

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│  User Browser                                   │
│  https://ai-job-fraud-detector.vercel.app       │
└────────────────┬────────────────────────────────┘
                 │
                 │ API Requests
                 │ (with REACT_APP_API_URL)
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Render Backend                                 │
│  https://ai-job-fraud-detector.onrender.com     │
│                                                 │
│  ├─ CORS: Allow Vercel origin                  │
│  ├─ Routes: /api/auth/*, /api/analyze-job      │
│  └─ MongoDB: Atlas connection                  │
└─────────────────────────────────────────────────┘
```

---

## ✅ Verification Steps

After deployment:

1. ✅ Frontend loads at Vercel URL
2. ✅ Backend responds at Render URL
3. ✅ Login redirects to backend URL (check Network tab)
4. ✅ No CORS errors in console
5. ✅ JWT token stored in localStorage
6. ✅ Protected routes work
7. ✅ Job analysis works
8. ✅ History page loads

---

## 🎯 Key Takeaways

1. **Always use environment variables** for API URLs
2. **Never use relative paths** for cross-origin API calls
3. **CORS must be configured** on backend for production
4. **Redeploy is required** after changing environment variables
5. **Test thoroughly** after deployment

---

## 📞 Support

If issues persist:

1. Check Vercel deployment logs
2. Check Render deployment logs
3. Check browser console for errors
4. Check Network tab for request URLs
5. Verify environment variables are set correctly

**Your deployment should now work perfectly! 🎉**
