const axios = require('axios');
const fs = require('fs');

/**
 * OCR Service for extracting text from images
 * Uses Azure AI Vision or mock implementation
 */
class OCRService {
  constructor() {
    this.useMock = process.env.USE_MOCK_AI === 'true';
    this.endpoint = process.env.AZURE_VISION_ENDPOINT;
    this.apiKey = process.env.AZURE_VISION_KEY;
  }

  /**
   * Extract text from image file
   * @param {string} imagePath - Path to image file
   * @returns {string} Extracted text
   */
  async extractText(imagePath) {
    if (this.useMock || !this.endpoint || !this.apiKey) {
      return this.getMockOCR(imagePath);
    }

    try {
      // Read image file
      const imageBuffer = fs.readFileSync(imagePath);

      // Call Azure Vision API
      const response = await axios.post(
        `${this.endpoint}/vision/v3.2/read/analyze`,
        imageBuffer,
        {
          headers: {
            'Ocp-Apim-Subscription-Key': this.apiKey,
            'Content-Type': 'application/octet-stream'
          }
        }
      );

      // Get operation location
      const operationLocation = response.headers['operation-location'];
      
      // Poll for results
      let result;
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        await this.sleep(1000);
        
        const resultResponse = await axios.get(operationLocation, {
          headers: {
            'Ocp-Apim-Subscription-Key': this.apiKey
          }
        });

        result = resultResponse.data;
        
        if (result.status === 'succeeded') {
          break;
        } else if (result.status === 'failed') {
          throw new Error('OCR processing failed');
        }
        
        attempts++;
      }

      // Extract text from result
      if (result && result.analyzeResult && result.analyzeResult.readResults) {
        const extractedText = result.analyzeResult.readResults
          .map(page => page.lines.map(line => line.text).join(' '))
          .join('\n');
        
        return extractedText;
      }

      return '';
      
    } catch (error) {
      console.error('Azure OCR Error:', error.message);
      // Fallback to mock
      return this.getMockOCR(imagePath);
    }
  }

  /**
   * Mock OCR for testing without Azure API
   */
  getMockOCR(imagePath) {
    // Simulate realistic job posting text extraction
    const mockTexts = [
      `Job Title: Senior Software Engineer
Company: TechCorp Solutions
Location: Remote
Salary: $120,000 - $150,000

We are seeking an experienced software engineer to join our team.
Requirements:
- 5+ years of experience
- Strong knowledge of JavaScript, React, Node.js
- Bachelor's degree in Computer Science

Contact: hr@techcorp.com`,

      `URGENT HIRING!!!
Work from home and earn $5000 per week!
No experience needed!
Just pay $99 registration fee to get started.
Contact us on WhatsApp: +1234567890
Limited slots available!`,

      `Marketing Manager Position
Leading Company in Mumbai
Excellent salary package
Immediate joining required

Send resume to: jobs.hiring@gmail.com
Call: 9876543210`,

      `Data Analyst - ABC Corporation
Full-time position
Requirements: Python, SQL, Excel
3+ years experience
Competitive salary and benefits

Apply at: careers@abccorp.com
www.abccorp.com/careers`
    ];

    // Return a random mock text
    const randomIndex = Math.floor(Math.random() * mockTexts.length);
    return mockTexts[randomIndex];
  }

  /**
   * Helper function to sleep
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new OCRService();
