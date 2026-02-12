/**
 * Rule-Based Fraud Detection Service
 * Analyzes job postings for common fraud indicators with priority-based detection
 * Uses context-aware phrase matching to prevent false positives
 */

class FraudDetectionService {
  constructor() {
    // CRITICAL fraud patterns - These ALWAYS result in "Potential Scam" verdict
    // Using regex patterns for precise phrase matching with word boundaries
    this.criticalPatterns = {
      // Payment-related phrases (must include fee/payment context)
      paymentPhrases: [
        /\bregistration\s+fee\b/i,
        /\bprocessing\s+fee\b/i,
        /\btraining\s+fee\b/i,
        /\bapplication\s+fee\b/i,
        /\bmembership\s+fee\b/i,
        /\badmin\s+fee\b/i,
        /\bjoining\s+fee\b/i,
        /\bonboarding\s+fee\b/i,
        /\bcertification\s+fee\b/i,
        /\bid\s+generation\s+fee\b/i,
        /\bbackground\s+check\s+fee\b/i,
        /\bverification\s+fee\b/i,
        /\bactivation\s+fee\b/i,
        /\bsetup\s+fee\b/i,
        /\benrollment\s+fee\b/i,
        /\bstarter\s+kit\s+fee\b/i,
        /\bmaterial\s+fee\b/i,
        /\bequipment\s+fee\b/i,
        /\bsecurity\s+deposit\b/i,
        /\brefundable\s+(fee|deposit)\b/i,
        /\badvance\s+payment\b/i,
        /\bpay\s+upfront\b/i,
        /\bpaid\s+assessment\b/i,
        /\bpaid\s+training\b/i,
        /\bpaid\s+certification\b/i,
      ],
      
      // Direct payment demands
      paymentDemands: [
        /\bpay\s+(for\s+)?(training|certification|materials?|equipment)\b/i,
        /\bpayment\s+(is\s+)?required\b/i,
        /\bfee\s+(is\s+)?required\b/i,
        /\bmust\s+pay\b/i,
        /\bneed\s+to\s+pay\b/i,
        /\bhave\s+to\s+pay\b/i,
        /\bcharge\s+(for|of)\b/i,
        /\bcost\s+to\s+join\b/i,
        /\bdeposit\s+(of|is|required)\b/i,
      ],
      
      // Currency amounts (strong indicator when combined with fee context)
      currencyPatterns: [
        /\b(pay|fee|deposit|charge|cost)\s*[:\-]?\s*[$₹£€¥]\s*\d+/i,
        /\b(pay|fee|deposit|charge|cost)\s*[:\-]?\s*(rs\.?|inr|usd)\s*\d+/i,
        /[$₹£€¥]\s*\d+\s*(registration|processing|training|application|onboarding|certification)/i,
        /\d+\s*(dollars?|rupees?|pounds?|euros?)\s*(fee|deposit|payment)/i,
      ],
    };
    
    // Safe phrases that should NOT trigger critical alerts
    this.safePatterns = [
      /\bregistration\s+(process|procedure|system|portal|form|link|page|deadline|opens?|closes?)\b/i,
      /\bapplication\s+(process|procedure|system|portal|form|link|page|deadline)\b/i,
      /\bregistered\s+(candidates?|applicants?|users?|members?|companies?|trademark)\b/i,
      /\bregistration\s+(is|will\s+be)\s+(open|closed|available|mandatory|optional)\b/i,
      /\bcomplete\s+(the\s+)?registration\b/i,
      /\bafter\s+registration\b/i,
      /\bsuccessful\s+registration\b/i,
      /\bno\s+(fee|fees|cost|charge|payment)\b/i,
      /\bfree\s+(of\s+charge|training|certification)\b/i,
    ];

    // HIGH RISK fraud patterns
    this.patterns = {
      unrealisticSalary: [
        'earn $10000', 'make $5000', 'guaranteed income', 'easy money',
        'work from home earn', 'unlimited earning', 'get rich', 'fast cash',
        'earn lakhs', 'earn thousands weekly'
      ],
      suspiciousContact: [
        'whatsapp', 'telegram', 'signal app', 'wickr', 'kik messenger',
        'contact via whatsapp', 'message on telegram', 'dm on instagram'
      ],
      personalEmails: [
        '@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com',
        '@aol.com', '@mail.com', '@protonmail.com', '@icloud.com'
      ],
      vagueCompany: [
        'leading company', 'reputed company', 'top company', 'multinational company',
        'well established', 'growing company', 'startup company', 'confidential'
      ],
      urgencyTactics: [
        'apply now', 'limited slots', 'hurry', 'immediate joining',
        'urgent requirement', 'only few positions', 'act fast', 'don\'t miss'
      ],
      tooGoodToBeTrue: [
        'no experience required', 'anyone can apply', 'work 2 hours',
        'flexible timing', 'part time full pay', 'guaranteed selection'
      ]
    };
  }

  /**
   * Analyze text for fraud indicators with priority-based detection
   * Uses context-aware phrase matching to prevent false positives
   * @param {string} text - Combined job description text
   * @returns {object} Analysis results with score, reasons, and critical flag
   */
  analyze(text) {
    if (!text || text.trim().length === 0) {
      return {
        score: 50,
        reasons: ['No text provided for analysis'],
        details: {},
        hasCriticalFlags: false
      };
    }

    const reasons = [];
    let score = 0;
    const details = {};
    let hasCriticalFlags = false;

    console.log('\n🔍 === FRAUD DETECTION DEBUG ===');
    console.log('📝 Analyzing text (first 200 chars):', text.substring(0, 200));

    // 🔴 CRITICAL CHECK: Context-aware payment/fee detection
    const criticalMatches = this.findCriticalPaymentIndicators(text);
    
    if (criticalMatches.detected) {
      hasCriticalFlags = true;
      score = 100;
      
      console.log('🚨 CRITICAL FLAG TRIGGERED!');
      console.log('📍 Matched patterns:', criticalMatches.matches);
      console.log('📄 Matched text spans:', criticalMatches.textSpans);
      
      reasons.push(`🔴 CRITICAL: Job requires payment or fees - "${criticalMatches.matches[0]}"`);
      reasons.push(`🚨 Legitimate employers NEVER ask for money upfront`);
      details.criticalPaymentMentions = criticalMatches.matches;
      details.matchedTextSpans = criticalMatches.textSpans;
      
      return {
        score: 100,
        reasons,
        details,
        hasCriticalFlags: true,
        criticalReason: 'Payment or fee requirement detected',
        debugInfo: {
          triggeredBy: criticalMatches.matches,
          textSpans: criticalMatches.textSpans
        }
      };
    }
    
    console.log('✅ No critical payment indicators found');

    // HIGH RISK: Unrealistic salary promises (25 points)
    const lowerText = text.toLowerCase();
    const salaryMatches = this.findMatches(lowerText, this.patterns.unrealisticSalary);
    if (salaryMatches.length > 0) {
      score += 25;
      reasons.push(`💰 Unrealistic salary promises: "${salaryMatches[0]}"`);
      details.salaryPromises = salaryMatches;
      console.log('⚠️ Unrealistic salary detected:', salaryMatches[0]);
    }

    // HIGH RISK: Suspicious contact methods (20 points)
    const contactMatches = this.findMatches(lowerText, this.patterns.suspiciousContact);
    if (contactMatches.length > 0) {
      score += 20;
      reasons.push(`📱 Suspicious contact method: ${contactMatches[0]}`);
      details.suspiciousContact = contactMatches;
      console.log('⚠️ Suspicious contact detected:', contactMatches[0]);
    }

    // MEDIUM RISK: Personal email domains (15 points)
    const emailMatches = this.findMatches(lowerText, this.patterns.personalEmails);
    if (emailMatches.length > 0) {
      score += 15;
      reasons.push(`📧 Uses personal email domain: ${emailMatches[0]}`);
      details.personalEmail = emailMatches;
      console.log('⚠️ Personal email detected:', emailMatches[0]);
    }

    // MEDIUM RISK: Vague company information (10 points)
    const vagueMatches = this.findMatches(lowerText, this.patterns.vagueCompany);
    if (vagueMatches.length > 0 && !this.hasSpecificCompanyName(text)) {
      score += 10;
      reasons.push(`🏢 Vague company description without specific name`);
      details.vagueCompany = true;
      console.log('⚠️ Vague company detected');
    }

    // LOW RISK: Urgency tactics (10 points)
    const urgencyMatches = this.findMatches(lowerText, this.patterns.urgencyTactics);
    if (urgencyMatches.length > 2) {
      score += 10;
      reasons.push(`⏰ Uses excessive urgency tactics`);
      details.urgencyTactics = urgencyMatches;
      console.log('⚠️ Urgency tactics detected:', urgencyMatches.length, 'instances');
    }

    // LOW RISK: "Too good to be true" claims (10 points)
    const tooGoodMatches = this.findMatches(lowerText, this.patterns.tooGoodToBeTrue);
    if (tooGoodMatches.length > 2) {
      score += 10;
      reasons.push(`✨ Makes unrealistic promises about job requirements`);
      details.tooGoodToBeTrue = tooGoodMatches;
      console.log('⚠️ Too good to be true detected:', tooGoodMatches.length, 'instances');
    }

    // Check text length and quality
    if (text.trim().length < 100) {
      score += 5;
      reasons.push(`📝 Very short job description (lacks detail)`);
      console.log('⚠️ Short description detected');
    }

    // Cap score at 100
    score = Math.min(score, 100);

    console.log('📊 Final non-critical score:', score);
    console.log('🔍 === END FRAUD DETECTION ===\n');

    // Add positive indicators ONLY if score is low and no red flags
    if (score < 30 && reasons.length === 0) {
      reasons.push('✅ No critical red flags detected');
      reasons.push('✅ Professional language and structure');
      reasons.push('✅ No payment requirements found');
    }

    return {
      score,
      reasons,
      details,
      hasCriticalFlags: false
    };
  }

  /**
   * Context-aware critical payment indicator detection
   * Uses regex patterns and safe phrase filtering to prevent false positives
   * @param {string} text - Job description text
   * @returns {object} Detection result with matches and text spans
   */
  findCriticalPaymentIndicators(text) {
    const matches = [];
    const textSpans = [];
    
    // First, check if text contains safe phrases that should prevent triggering
    for (const safePattern of this.safePatterns) {
      if (safePattern.test(text)) {
        console.log('✅ Safe phrase detected:', text.match(safePattern)?.[0]);
        // Continue checking - safe phrases don't automatically clear, but we log them
      }
    }
    
    // Check payment phrases (e.g., "registration fee", "security deposit")
    for (const pattern of this.criticalPatterns.paymentPhrases) {
      const match = text.match(pattern);
      if (match) {
        const matchedText = match[0];
        const startIndex = match.index;
        const endIndex = startIndex + matchedText.length;
        
        // Extract context (50 chars before and after)
        const contextStart = Math.max(0, startIndex - 50);
        const contextEnd = Math.min(text.length, endIndex + 50);
        const context = text.substring(contextStart, contextEnd);
        
        // Check if this is in a safe context
        let isSafe = false;
        for (const safePattern of this.safePatterns) {
          if (safePattern.test(context)) {
            console.log(`⚠️ Potential match "${matchedText}" found but in safe context:`, context);
            isSafe = true;
            break;
          }
        }
        
        if (!isSafe) {
          matches.push(matchedText);
          textSpans.push({
            match: matchedText,
            context: context,
            position: { start: startIndex, end: endIndex }
          });
          console.log(`🔴 CRITICAL MATCH: "${matchedText}"`);
          console.log(`📍 Context: "${context}"`);
        }
      }
    }
    
    // Check payment demands (e.g., "must pay", "payment required")
    for (const pattern of this.criticalPatterns.paymentDemands) {
      const match = text.match(pattern);
      if (match) {
        const matchedText = match[0];
        const startIndex = match.index;
        const endIndex = startIndex + matchedText.length;
        const contextStart = Math.max(0, startIndex - 50);
        const contextEnd = Math.min(text.length, endIndex + 50);
        const context = text.substring(contextStart, contextEnd);
        
        matches.push(matchedText);
        textSpans.push({
          match: matchedText,
          context: context,
          position: { start: startIndex, end: endIndex }
        });
        console.log(`🔴 PAYMENT DEMAND: "${matchedText}"`);
        console.log(`📍 Context: "${context}"`);
      }
    }
    
    // Check currency patterns (e.g., "$99 registration", "pay ₹500")
    for (const pattern of this.criticalPatterns.currencyPatterns) {
      const match = text.match(pattern);
      if (match) {
        const matchedText = match[0];
        const startIndex = match.index;
        const endIndex = startIndex + matchedText.length;
        const contextStart = Math.max(0, startIndex - 50);
        const contextEnd = Math.min(text.length, endIndex + 50);
        const context = text.substring(contextStart, contextEnd);
        
        matches.push(matchedText);
        textSpans.push({
          match: matchedText,
          context: context,
          position: { start: startIndex, end: endIndex }
        });
        console.log(`🔴 CURRENCY PATTERN: "${matchedText}"`);
        console.log(`📍 Context: "${context}"`);
      }
    }
    
    return {
      detected: matches.length > 0,
      matches: [...new Set(matches)], // Remove duplicates
      textSpans: textSpans
    };
  }
  
  /**
   * Find matching patterns in text (legacy method for non-critical checks)
   */
  findMatches(text, patterns) {
    const matches = [];
    for (const pattern of patterns) {
      if (text.includes(pattern.toLowerCase())) {
        matches.push(pattern);
      }
    }
    return matches;
  }

  /**
   * Check if text contains a specific company name
   */
  hasSpecificCompanyName(text) {
    // Simple heuristic: look for capitalized words that might be company names
    const capitalizedWords = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
    const commonWords = ['the', 'company', 'job', 'position', 'role', 'candidate'];
    
    const potentialCompanyNames = capitalizedWords.filter(word => 
      !commonWords.includes(word.toLowerCase()) && word.length > 3
    );
    
    return potentialCompanyNames.length > 0;
  }

  /**
   * Get risk status based on score and critical flags
   * @param {number} score - Risk score
   * @param {boolean} hasCriticalFlags - Whether critical rules were triggered
   */
  getStatus(score, hasCriticalFlags = false) {
    // Critical flags ALWAYS result in "Potential Scam"
    if (hasCriticalFlags) {
      return 'Potential Scam';
    }
    
    if (score <= 30) return 'Likely Legit';
    if (score <= 70) return 'Suspicious';
    return 'Potential Scam';
  }
}

module.exports = new FraudDetectionService();
