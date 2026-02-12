const OpenAI = require('openai');

/**
 * AI Service for job fraud detection using LLM
 */
class AIService {
  constructor() {
    this.useMock = process.env.USE_MOCK_AI === 'true';
    
    if (!this.useMock && process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      this.model = process.env.OPENAI_MODEL || 'gpt-4';
    }
  }

  /**
   * Analyze job text using AI
   * @param {string} text - Job description text
   * @returns {object} AI analysis results
   */
  async analyzeJobText(text) {
    if (this.useMock || !this.openai) {
      return this.getMockAnalysis(text);
    }

    try {
      const prompt = this.buildPrompt(text);
      
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an AI fraud detection assistant specializing in identifying fake job postings. Provide structured, accurate analysis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      const response = completion.choices[0].message.content;
      return this.parseAIResponse(response);
      
    } catch (error) {
      console.error('OpenAI API Error:', error);
      // Fallback to mock if API fails
      return this.getMockAnalysis(text);
    }
  }

  /**
   * Build analysis prompt
   */
  buildPrompt(text) {
    return `You are an AI fraud detection assistant. Analyze the following job description and determine whether it is Legit, Suspicious, or Fake.

Identify red flags such as:
- Payment or fee requests
- Vague company details
- Unrealistic salaries or promises
- Suspicious contact methods (WhatsApp, Telegram, personal emails)
- Poor grammar or unprofessional language
- Urgency tactics or pressure
- Too-good-to-be-true claims

Job Description:
"""
${text}
"""

Provide your analysis in the following format:
Classification: [Legit/Suspicious/Fake]
Confidence: [0-100]
Red Flags:
- [List each red flag on a new line with a dash]

Be specific and reference actual content from the job description.`;
  }

  /**
   * Parse AI response into structured format
   */
  parseAIResponse(response) {
    const lines = response.split('\n').filter(line => line.trim());
    
    let classification = 'Suspicious';
    let confidence = 50;
    const redFlags = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.toLowerCase().includes('classification:')) {
        const match = line.match(/classification:\s*(legit|suspicious|fake)/i);
        if (match) classification = match[1];
      }
      
      if (line.toLowerCase().includes('confidence:')) {
        const match = line.match(/confidence:\s*(\d+)/i);
        if (match) confidence = parseInt(match[1]);
      }
      
      if (line.startsWith('-') || line.startsWith('•')) {
        redFlags.push(line.substring(1).trim());
      }
    }

    // Convert classification to score
    let score = 50;
    if (classification.toLowerCase() === 'legit') score = 20;
    else if (classification.toLowerCase() === 'fake') score = 90;
    else score = 55;

    return {
      classification,
      confidence,
      score,
      redFlags: redFlags.length > 0 ? redFlags : ['AI analysis completed']
    };
  }

  /**
   * Mock AI analysis for testing without API keys
   */
  getMockAnalysis(text) {
    const lowerText = text.toLowerCase();
    let score = 30;
    const redFlags = [];

    // Simulate AI detection
    if (lowerText.includes('fee') || lowerText.includes('payment') || lowerText.includes('deposit')) {
      score += 35;
      redFlags.push('Mentions payment or fees which is unusual for legitimate jobs');
    }

    if (lowerText.includes('whatsapp') || lowerText.includes('telegram')) {
      score += 25;
      redFlags.push('Uses informal messaging apps instead of professional communication');
    }

    if (lowerText.includes('gmail') || lowerText.includes('yahoo')) {
      score += 15;
      redFlags.push('Uses personal email domain instead of company domain');
    }

    if (lowerText.includes('earn') && (lowerText.includes('$') || lowerText.includes('money'))) {
      score += 20;
      redFlags.push('Makes unrealistic income promises');
    }

    if (text.length < 100) {
      score += 10;
      redFlags.push('Job description is unusually brief and lacks important details');
    }

    if (redFlags.length === 0) {
      redFlags.push('No major red flags detected by AI analysis');
      redFlags.push('Job posting appears to follow professional standards');
    }

    score = Math.min(score, 100);

    let classification = 'Legit';
    if (score > 70) classification = 'Fake';
    else if (score > 30) classification = 'Suspicious';

    return {
      classification,
      confidence: Math.min(score + 10, 95),
      score,
      redFlags
    };
  }
}

module.exports = new AIService();
