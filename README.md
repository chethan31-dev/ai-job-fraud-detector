# AI-Powered Fake Job Detection System

A production-quality MERN stack application that detects fake or suspicious job postings using AI-powered text and image analysis.

## Features

- **Authentication**: Secure JWT-based user registration and login
- **Multi-Modal Analysis**: Analyze job descriptions via text input and/or image upload
- **AI-Powered Detection**: Combines rule-based checks with LLM analysis
- **OCR Integration**: Extracts text from job posting screenshots
- **Explainable AI**: Provides detailed reasons for fraud detection
- **User History**: Track all previous job analyses
- **Modern UI**: Clean, professional interface with Tailwind CSS and Framer Motion

## Tech Stack

### Frontend
- React (Hooks & Functional Components)
- Tailwind CSS
- Framer Motion
- Axios

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- Multer (File Upload)

### AI Services
- OpenAI GPT-4 (Text Analysis)
- Azure AI Vision (OCR)
- Rule-based fraud detection

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Setup Environment
```bash
# Copy environment template
copy .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Start MongoDB
```bash
# Windows
net start MongoDB

# Mac/Linux
mongod

# Or use MongoDB Atlas (cloud)
```

### 4. Start the Application
```bash
# Terminal 1 - Backend
node server/server.js

# Terminal 2 - Frontend
cd client
npm start
```

### 5. Open Browser
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

**📖 For detailed instructions, see [HOW_TO_START.md](HOW_TO_START.md)**

---

## Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. **Clone and install dependencies**
```bash
npm run install-all
```

2. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start MongoDB** (if running locally)
```bash
mongod
```

4. **Run the application**
```bash
# Development mode (both frontend and backend)
npm run dev

# Backend only
npm run server

# Frontend only
npm run client
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `OPENAI_API_KEY` | OpenAI API key | No* |
| `AZURE_VISION_ENDPOINT` | Azure Vision endpoint | No* |
| `AZURE_VISION_KEY` | Azure Vision key | No* |
| `USE_MOCK_AI` | Use mock AI responses | No |

*If API keys are not provided, set `USE_MOCK_AI=true` for mock implementations

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Job Analysis
- `POST /api/analyze-job` - Analyze job posting (requires auth)
- `GET /api/history` - Get user's analysis history (requires auth)

## Fraud Detection Logic

### Rule-Based Checks (60% weight)
- Payment/fee mentions
- Unrealistic salary promises
- Suspicious contact methods (WhatsApp, Telegram)
- Personal email domains
- Vague company information

### AI Analysis (40% weight)
- LLM-powered fraud detection
- Confidence scoring
- Red flag identification

### Final Score Calculation
```
finalScore = (ruleScore × 0.6) + (aiScore × 0.4)
```

### Risk Categories
- **0-30**: Likely Legit (Green)
- **31-70**: Suspicious (Yellow)
- **71-100**: Likely Fake (Red)

## Project Structure

```
├── server/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & validation
│   ├── services/        # AI & business logic
│   ├── config/          # Configuration
│   └── server.js        # Entry point
├── client/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API calls
│   │   ├── context/     # Auth context
│   │   └── App.js       # Main app
│   └── package.json
└── package.json
```

## Usage

1. **Register/Login**: Create an account or login
2. **Analyze Job**: Enter job description text and/or upload screenshot
3. **View Results**: See risk score, status, and detailed reasons
4. **Check History**: Review all previous analyses

## Mock Mode

For testing without API keys, set `USE_MOCK_AI=true` in `.env`. The system will use realistic mock responses that simulate actual AI behavior.

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure production MongoDB (MongoDB Atlas recommended)
4. Add real API keys for OpenAI and Azure
5. Set up proper CORS origins
6. Enable HTTPS
7. Configure file upload limits

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation
- Secure file upload handling

## Future Enhancements

- Email notifications
- Batch analysis
- Company verification database
- Machine learning model training
- Advanced analytics dashboard
- Report generation

## License

MIT

## Author

Built as a production-quality portfolio project demonstrating full-stack development with AI integration.
