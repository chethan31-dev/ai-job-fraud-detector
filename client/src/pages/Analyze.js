import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeJob } from '../services/api';
import ImageUpload from '../components/ImageUpload';
import RiskBar from '../components/RiskBar';
import ReasonsList from '../components/ReasonsList';

const Analyze = () => {
  const [jobText, setJobText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!jobText?.trim() && !selectedImage) {
      setError('Please provide job description text or upload an image');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      if (jobText?.trim()) formData.append('jobText', jobText);
      if (selectedImage) formData.append('image', selectedImage);

      const response = await analyzeJob(formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setJobText('');
    setSelectedImage(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analyze Job Posting</h1>
          <p className="text-slate-600 mt-2">
            Enter job description text or upload an image to detect potential fraud
          </p>
        </div>

        {/* Analysis Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
                <p className="text-sm text-rose-700">{error}</p>
              </div>
            )}

            {/* Text Input */}
            <div>
              <label htmlFor="jobText" className="block text-sm font-medium text-slate-700 mb-2">
                Job Description Text (Optional)
              </label>
              <textarea
                id="jobText"
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Paste the job description here...&#10;&#10;Example:&#10;Job Title: Software Engineer&#10;Company: Tech Corp&#10;Salary: $100,000&#10;Requirements: 5+ years experience..."
              />
              <p className="text-xs text-slate-500 mt-2">
                Tip: Include company name, salary, requirements, and contact information for better analysis
              </p>
            </div>

            {/* Image Upload */}
            <ImageUpload
              onImageSelect={setSelectedImage}
              selectedImage={selectedImage}
            />

            {/* Submit Button */}
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={loading || (!jobText && !selectedImage)}
                className="flex-1 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  'Analyze Job Posting'
                )}
              </button>
              
              {(jobText || selectedImage || result) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Risk Score Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Analysis Results</h2>
                  {result.hasCriticalFlags && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-300">
                      🚨 CRITICAL ALERT
                    </span>
                  )}
                </div>
                <RiskBar score={result.riskScore} />
                
                {/* Additional Info */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs font-medium text-slate-600 mb-1">AI Confidence</p>
                    <p className="text-2xl font-bold text-slate-900">{result.aiConfidence}%</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs font-medium text-slate-600 mb-1">Analysis Method</p>
                    <p className="text-sm text-slate-900">Rule-Based + AI</p>
                  </div>
                </div>

                {/* Score Breakdown */}
                {result.breakdown && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs font-medium text-slate-600 mb-3">Score Breakdown</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-700">
                          Rule-Based Score ({result.breakdown.weights.ruleBased})
                        </span>
                        <span className="font-medium text-slate-900">{result.breakdown.ruleBasedScore}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-700">
                          AI Score ({result.breakdown.weights.ai})
                        </span>
                        <span className="font-medium text-slate-900">{result.breakdown.aiScore}</span>
                      </div>
                      {result.hasCriticalFlags && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <p className="text-xs text-rose-700 font-medium">
                            ⚠️ Critical rule override active - AI score ignored
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Reasons Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <ReasonsList reasons={result.reasons} />
              </div>

              {/* Info Card */}
              <div className={`${
                result.hasCriticalFlags 
                  ? 'bg-rose-50 border-rose-200' 
                  : 'bg-blue-50 border-blue-200'
              } border rounded-xl p-4`}>
                <div className="flex items-start space-x-3">
                  <svg className={`w-5 h-5 ${
                    result.hasCriticalFlags ? 'text-rose-600' : 'text-blue-600'
                  } mt-0.5 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {result.hasCriticalFlags ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      result.hasCriticalFlags ? 'text-rose-900' : 'text-blue-900'
                    }`}>
                      {result.hasCriticalFlags ? '🚨 Critical Scam Indicators Detected' : 'Analysis Complete'}
                    </p>
                    <p className={`text-sm ${
                      result.hasCriticalFlags ? 'text-rose-700' : 'text-blue-700'
                    } mt-1`}>
                      {result.hasCriticalFlags 
                        ? 'This job posting contains critical red flags that indicate a potential scam. Legitimate employers NEVER ask for money, fees, or deposits upfront. Do not proceed with this opportunity.'
                        : 'This analysis has been saved to your history. Always verify job postings through official company websites and be cautious of requests for payment or personal information.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Analyze;
