# How to Start the AI Job Fraud Detector Project

## 🚀 Quick Start (5 Minutes)

### Prerequisites
Before starting, make sure you have:
- ✅ Node.js (v16 or higher) - [Download here](https://nodejs.org/)
- ✅ MongoDB installed OR MongoDB Atlas account
- ✅ A code editor (VS Code recommended)

### Step 1: Install Dependencies (2 minutes)

Open terminal in the project folder and run:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

This will install all required packages for both frontend and backend.

### Step 2: Setup Environment Variables (1 minute)

Create a `.env` file in the root directory:

```bash
# Copy the example file
copy .env.example .env
```

Edit `.env` with your settings:

```env
PORT=5000
NODE_ENV=development

# MongoDB - Choose one option:
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/job-fraud-detector

# Option 2: MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job-fraud-detector

# JWT Secret (change this!)
JWT_SECRET=your_super_secret_key_change_this_in_production

# Mock Mode (set to true to test without API keys)
USE_MOCK_AI=true

# Optional: Real AI APIs (leave empty if using mock mode)
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4
AZURE_VISION_ENDPOINT=
AZURE_VISION_KEY=
```

### Step 3: Start MongoDB (if using local)

**Windows:**
```bash
# Start MongoDB service
net start MongoDB
```

**Mac/Linux:**
```bash
mongod
```

**Or use MongoDB Atlas (Cloud):**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Get connection string
5. Update `MONGODB_URI` in `.env`

### Step 4: Start the Application (1 minute)

**Option A: Start Both (Recommended)**

Open TWO terminal windows:

**Terminal 1 - Backend:**
```bash
node server/server.js
```

You should see:
```
🚀 Server running on port 5000
🤖 Mock AI Mode: ENABLED
✅ MongoDB Connected
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

You should see:
```
Compiled successfully!
Local: http://localhost:3000
```

**Option B: Using npm scripts (if configured)**
```bash
npm run dev
```

### Step 5: Open the Application

Open your browser and go to:
**http://localhost:3000**

You should see the login/register page!

---

## 📖 Detailed Startup Process

### What Happens When You Start?

#### Backend (Port 5000)
1. ✅ Loads environment variables from `.env`
2. ✅ Connects to MongoDB database
3. ✅ Initializes Express server
4. ✅ Sets up API routes
5. ✅ Starts listening on port 5000

#### Frontend (Port 3000)
1. ✅ Compiles React application
2. ✅ Starts development server
3. ✅ Opens browser automatically
4. ✅ Hot-reload enabled (changes reflect instantly)

---

## 🎯 First Time Usage

### 1. Register an Account
- Click "Sign up"
- Enter your name, email, and password
- Click "Create Account"

### 2. Analyze Your First Job
- Click "Analyze Job" in the navbar
- Paste a job description OR upload an image
- Click "Analyze Job Posting"
- See the fraud detection results!

### 3. View History
- Click "History" to see all your past analyses
- Expand any analysis to see full details
- Delete old analyses if needed

---

## 🔧 Development Workflow

### Making Changes

**Frontend Changes:**
1. Edit files in `client/src/`
2. Save the file
3. Browser auto-refreshes with changes

**Backend Changes:**
1. Edit files in `server/`
2. Save the file
3. Restart backend: `Ctrl+C` then `node server/server.js`

### Testing

**Test Legitimate Job:**
```
Software Engineer - Google
Mountain View, CA
Salary: $150,000

Requirements:
- 5+ years experience
- Strong programming skills

Apply: careers.google.com
```
Expected: ✅ Likely Legit (Low score)

**Test Fake Job:**
```
Work from home!
Earn $5000/week!
Pay $99 registration fee to start.
Contact: WhatsApp +1234567890
```
Expected: 🚨 Potential Scam (High score)

---

## 🛠️ Troubleshooting

### Issue: MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
- Start MongoDB: `net start MongoDB` (Windows) or `mongod` (Mac/Linux)
- Or use MongoDB Atlas cloud database

### Issue: Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
- Kill the process using port 5000
- Or change PORT in `.env` to 5001

### Issue: Module Not Found
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
npm install
cd client
npm install
```

### Issue: React Not Starting
```
Error: Cannot find module 'react'
```

**Solution:**
```bash
cd client
npm install
npm start
```

---

## 📁 Project Structure

```
ai-job-fraud-detector/
│
├── server/                 # Backend (Node.js/Express)
│   ├── config/            # Configuration (Multer)
│   ├── middleware/        # Auth middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic & AI
│   └── server.js          # Entry point
│
├── client/                # Frontend (React)
│   ├── public/           # Static files
│   └── src/
│       ├── components/   # Reusable components
│       ├── context/      # Auth context
│       ├── pages/        # Page components
│       ├── services/     # API calls
│       └── App.js        # Main app
│
├── uploads/              # Uploaded images
├── .env                  # Environment variables
├── .env.example          # Environment template
├── package.json          # Backend dependencies
└── README.md             # Documentation
```

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Job Analysis
- `POST /api/analyze-job` - Analyze job posting (requires auth)
- `GET /api/history` - Get analysis history (requires auth)
- `GET /api/analysis/:id` - Get specific analysis (requires auth)
- `DELETE /api/analysis/:id` - Delete analysis (requires auth)

### Health Check
- `GET /api/health` - Check API status

---

## 🔐 Security Notes

### For Development:
- ✅ Mock AI mode enabled (no API keys needed)
- ✅ Simple JWT secret is fine
- ✅ Local MongoDB is okay

### For Production:
- ⚠️ Use strong JWT_SECRET (32+ characters)
- ⚠️ Use MongoDB Atlas or secure MongoDB
- ⚠️ Add real API keys (OpenAI, Azure)
- ⚠️ Enable HTTPS
- ⚠️ Set NODE_ENV=production

---

## 📊 Features Overview

### 1. Authentication
- User registration with email/password
- JWT-based authentication
- Protected routes

### 2. Job Analysis
- Text input analysis
- Image upload with OCR
- Dual detection system:
  - Rule-based (60% weight)
  - AI-powered (40% weight)

### 3. Fraud Detection
- Payment/fee detection (CRITICAL)
- Suspicious contact methods
- Personal email domains
- Unrealistic salary promises
- Vague company information

### 4. Results
- Risk score (0-100)
- Status: Likely Legit / Suspicious / Potential Scam
- Detailed reasons
- Explainable AI output

### 5. History
- View all past analyses
- Expandable details
- Delete functionality
- Pagination

---

## 🎓 Learning Resources

### Technologies Used:
- **Frontend:** React, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcrypt
- **AI:** OpenAI GPT-4, Azure AI Vision

### Useful Links:
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Tutorial](https://www.mongodb.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🚀 Next Steps

After getting the app running:

1. ✅ Test all features
2. ✅ Try different job descriptions
3. ✅ Upload job posting images
4. ✅ Check the history page
5. ✅ Explore the code
6. ✅ Customize the UI
7. ✅ Add more fraud detection rules
8. ✅ Deploy to production

---

## 💡 Tips

### Development Tips:
- Use `console.log()` to debug
- Check browser DevTools (F12) for errors
- Monitor backend terminal for logs
- Use React DevTools extension

### Performance Tips:
- Keep MongoDB indexed
- Use pagination for large datasets
- Optimize images before upload
- Cache API responses

### Code Quality:
- Follow existing code style
- Add comments for complex logic
- Test before committing
- Keep components small and focused

---

## 📞 Support

If you encounter issues:

1. Check this guide first
2. Review error messages in terminal
3. Check browser console (F12)
4. Verify MongoDB is running
5. Ensure all dependencies are installed
6. Check `.env` configuration

---

## ✅ Startup Checklist

Before starting development:

- [ ] Node.js installed (v16+)
- [ ] MongoDB installed or Atlas account ready
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] MongoDB running
- [ ] Backend starts without errors
- [ ] Frontend compiles successfully
- [ ] Can access http://localhost:3000
- [ ] Can register/login
- [ ] Can analyze jobs

**All checked? You're ready to go! 🎉**

---

## 🎯 Summary

**To start the project:**

```bash
# 1. Install dependencies
npm install
cd client && npm install && cd ..

# 2. Setup .env file
copy .env.example .env
# Edit .env with your settings

# 3. Start MongoDB (if local)
net start MongoDB

# 4. Start backend (Terminal 1)
node server/server.js

# 5. Start frontend (Terminal 2)
cd client
npm start

# 6. Open browser
# http://localhost:3000
```

**That's it! Happy coding! 🚀**
