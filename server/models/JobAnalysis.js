const mongoose = require('mongoose');

const jobAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  jobText: {
    type: String,
    default: ''
  },
  extractedImageText: {
    type: String,
    default: ''
  },
  imagePath: {
    type: String,
    default: null
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['Likely Legit', 'Suspicious', 'Potential Scam'],
    required: true
  },
  reasons: [{
    type: String
  }],
  aiConfidence: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  ruleBasedScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  aiScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
jobAnalysisSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('JobAnalysis', jobAnalysisSchema);
