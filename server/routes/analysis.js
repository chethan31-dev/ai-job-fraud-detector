const express = require('express');
const authMiddleware = require('../middleware/auth');
const upload = require('../config/multer');
const JobAnalysis = require('../models/JobAnalysis');
const ocrService = require('../services/ocrService');
const aiService = require('../services/aiService');
const fraudDetection = require('../services/fraudDetection');

const router = express.Router();

/**
 * @route   POST /api/analyze-job
 * @desc    Analyze job posting for fraud
 * @access  Private
 */
router.post('/analyze-job', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { jobText } = req.body;
    const imageFile = req.file;

    // Validate input
    if (!jobText && !imageFile) {
      return res.status(400).json({
        success: false,
        message: 'Please provide job description text or upload an image'
      });
    }

    let extractedImageText = '';
    let imagePath = null;

    // Extract text from image if provided
    if (imageFile) {
      console.log('Processing image:', imageFile.filename);
      imagePath = imageFile.path;
      extractedImageText = await ocrService.extractText(imageFile.path);
      console.log('Extracted text length:', extractedImageText.length);
    }

   


    // Combine all text
    const combinedText = `${jobText || ''}\n${extractedImageText || ''}`.trim();

    if (!combinedText) {
      return res.status(400).json({
        success: false,
        message: 'No text found to analyze'
      });
    }

    console.log('Analyzing combined text...');

    // Run rule-based fraud detection
    const ruleAnalysis = fraudDetection.analyze(combinedText);
    console.log('Rule-based score:', ruleAnalysis.score);
    console.log('Critical flags:', ruleAnalysis.hasCriticalFlags);

    // Run AI-based analysis
    const aiAnalysis = await aiService.analyzeJobText(combinedText);
    console.log('AI score:', aiAnalysis.score);

    // Calculate final score with CRITICAL RULE OVERRIDE
    let finalScore;
    let status;
    
    if (ruleAnalysis.hasCriticalFlags) {
      // CRITICAL OVERRIDE: Force minimum score of 85 for critical violations
      finalScore = Math.max(85, ruleAnalysis.score);
      status = 'Potential Scam'; // Force verdict
      console.log('🔴 CRITICAL FLAG TRIGGERED - Forcing Potential Scam verdict');
    } else {
      // Normal calculation: 60% rule-based, 40% AI
      finalScore = Math.round(
        (ruleAnalysis.score * 0.6) + (aiAnalysis.score * 0.4)
      );
      status = fraudDetection.getStatus(finalScore, false);
    }

    // Combine reasons with CRITICAL reasons first
    let allReasons = [];
    
    if (ruleAnalysis.hasCriticalFlags) {
      // Critical reasons go first and are always included
      allReasons = [...ruleAnalysis.reasons];
      
      // Add AI reasons only if they support the scam verdict
      const supportiveAIReasons = aiAnalysis.redFlags.filter(reason => 
        !reason.toLowerCase().includes('no major red flags') &&
        !reason.toLowerCase().includes('appears to follow professional')
      );
      allReasons = [...allReasons, ...supportiveAIReasons];
    } else {
      // Normal flow: combine all reasons
      allReasons = [
        ...ruleAnalysis.reasons,
        ...aiAnalysis.redFlags
      ];
    }

    // Remove duplicates and limit to top reasons
    const uniqueReasons = [...new Set(allReasons)].slice(0, 10);

    // Save analysis to database
    const analysis = new JobAnalysis({
      userId: req.userId,
      jobText: jobText || '',
      extractedImageText: extractedImageText || '',
      imagePath: imagePath ? imageFile.filename : null,
      riskScore: finalScore,
      status,
      reasons: uniqueReasons,
      aiConfidence: ruleAnalysis.hasCriticalFlags ? 100 : aiAnalysis.confidence,
      ruleBasedScore: ruleAnalysis.score,
      aiScore: aiAnalysis.score
    });

    await analysis.save();

    console.log('Analysis saved successfully');

    // Return results
    res.json({
      success: true,
      message: ruleAnalysis.hasCriticalFlags 
        ? '🚨 Critical scam indicators detected' 
        : 'Job analysis completed',
      data: {
        id: analysis._id,
        riskScore: finalScore,
        status,
        reasons: uniqueReasons,
        aiConfidence: ruleAnalysis.hasCriticalFlags ? 100 : aiAnalysis.confidence,
        hasCriticalFlags: ruleAnalysis.hasCriticalFlags,
        criticalReason: ruleAnalysis.criticalReason || null,
        breakdown: {
          ruleBasedScore: ruleAnalysis.score,
          aiScore: aiAnalysis.score,
          weights: ruleAnalysis.hasCriticalFlags 
            ? { ruleBased: '100%', ai: '0% (overridden by critical rule)' }
            : { ruleBased: '60%', ai: '40%' }
        },
        hasImage: !!imageFile,
        extractedTextLength: extractedImageText.length,
        createdAt: analysis.createdAt
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing job posting',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/history
 * @desc    Get user's analysis history
 * @access  Private
 */
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count
    const total = await JobAnalysis.countDocuments({ userId: req.userId });

    // Get analyses
    const analyses = await JobAnalysis.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    res.json({
      success: true,
      data: {
        analyses,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit
        }
      }
    });

  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analysis history',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/analysis/:id
 * @desc    Get specific analysis by ID
 * @access  Private
 */
router.get('/analysis/:id', authMiddleware, async (req, res) => {
  try {
    const analysis = await JobAnalysis.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    res.json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analysis',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/analysis/:id
 * @desc    Delete analysis
 * @access  Private
 */
router.delete('/analysis/:id', authMiddleware, async (req, res) => {
  try {
    const analysis = await JobAnalysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    res.json({
      success: true,
      message: 'Analysis deleted successfully'
    });

  } catch (error) {
    console.error('Delete analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting analysis',
      error: error.message
    });
  }
});

module.exports = router;
