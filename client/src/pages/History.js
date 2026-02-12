import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getHistory } from '../services/api';
import RiskBar from '../components/RiskBar';

const History = () => {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalAnalyses, setTotalAnalyses] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchAnalyses(currentPage);
  }, [currentPage]);

  const fetchAnalyses = async (page) => {
    setLoading(true);
    setError('');
    try {
      const response = await getHistory(page, ITEMS_PER_PAGE);
      setAnalyses(response.data.analyses);
      setTotalPages(response.data.pagination.pages);
      setTotalAnalyses(response.data.pagination.total);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch history. Please try again.');
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Likely Legit':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Suspicious':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Potential Scam':
      case 'Likely Fake':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Likely Legit':
        return '✓';
      case 'Suspicious':
        return '⚠';
      case 'Potential Scam':
      case 'Likely Fake':
        return '✕';
      default:
        return '?';
    }
  };

  const filteredAndSortedAnalyses = analyses
    .filter((analysis) => {
      const matchesSearch = analysis.jobText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           analysis._id?.includes(searchTerm);
      const matchesStatus = filterStatus === 'all' || analysis.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'risky') {
        return b.riskScore - a.riskScore;
      } else if (sortBy === 'safe') {
        return a.riskScore - b.riskScore;
      }
      return 0;
    });

  const handleExport = (analysis) => {
    const dataStr = JSON.stringify(analysis, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analysis-${analysis._id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analysis History</h1>
          <p className="text-slate-600 mt-2">
            View and manage all your job analysis results
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-lg border border-slate-200 p-4"
          >
            <div className="text-sm font-medium text-slate-600">Total Analyses</div>
            <div className="text-3xl font-bold text-slate-900 mt-2">{totalAnalyses}</div>
          </motion.div>
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-lg border border-slate-200 p-4"
          >
            <div className="text-sm font-medium text-emerald-600">Likely Legit</div>
            <div className="text-3xl font-bold text-emerald-600 mt-2">
              {analyses.filter(a => a.status === 'Likely Legit').length}
            </div>
          </motion.div>
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-lg border border-slate-200 p-4"
          >
            <div className="text-sm font-medium text-yellow-600">Suspicious</div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">
              {analyses.filter(a => a.status === 'Suspicious').length}
            </div>
          </motion.div>
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-lg border border-slate-200 p-4"
          >
            <div className="text-sm font-medium text-rose-600">Potential Scam</div>
            <div className="text-3xl font-bold text-rose-600 mt-2">
              {analyses.filter(a => a.status === 'Potential Scam' || a.status === 'Likely Fake').length}
            </div>
          </motion.div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by job text or ID..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Filter by Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              >
                <option value="all">All Statuses</option>
                <option value="Likely Legit">Likely Legit</option>
                <option value="Suspicious">Suspicious</option>
                <option value="Potential Scam">Potential Scam</option>
                <option value="Likely Fake">Likely Fake</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              >
                <option value="recent">Most Recent</option>
                <option value="risky">Most Risky</option>
                <option value="safe">Most Safe</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-rose-50 border border-rose-200 rounded-lg"
          >
            <p className="text-sm text-rose-700">{error}</p>
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : filteredAndSortedAnalyses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200"
          >
            <p className="text-slate-600 text-lg">No analyses found</p>
            <p className="text-slate-500 text-sm mt-1">
              {analyses.length === 0
                ? 'Start by analyzing a job posting'
                : 'Try adjusting your search filters'}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Analyses List */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <AnimatePresence>
                {filteredAndSortedAnalyses.map((analysis) => (
                  <motion.div
                    key={analysis._id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer overflow-hidden"
                    onClick={() => setSelectedAnalysis(analysis)}
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-white flex-shrink-0 ${
                                analysis.riskScore < 30
                                  ? 'bg-emerald-500'
                                  : analysis.riskScore < 70
                                  ? 'bg-yellow-500'
                                  : 'bg-rose-500'
                              }`}
                            >
                              {analysis.riskScore}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="truncate">
                                <p className="text-sm text-slate-600">Job ID: {analysis._id}</p>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">
                                {formatDate(analysis.createdAt)}
                              </p>
                              {analysis.jobText && (
                                <p className="text-sm text-slate-700 mt-2 line-clamp-2">
                                  {analysis.jobText.substring(0, 150)}
                                  {analysis.jobText.length > 150 ? '...' : ''}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Risk Bar */}
                          <div className="mt-3">
                            <RiskBar score={analysis.riskScore} />
                          </div>

                          {/* Reasons */}
                          {analysis.reasons && analysis.reasons.length > 0 && (
                            <div className="mt-3 text-xs text-slate-600">
                              <p className="font-medium mb-1">Key findings:</p>
                              <ul className="space-y-1">
                                {analysis.reasons.slice(0, 2).map((reason, idx) => (
                                  <li key={idx} className="line-clamp-1">
                                    • {reason}
                                  </li>
                                ))}
                                {analysis.reasons.length > 2 && (
                                  <li className="text-slate-500">
                                    +{analysis.reasons.length - 2} more findings
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Status and Actions */}
                        <div className="flex flex-col items-end gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                              analysis.status
                            )}`}
                          >
                            {getStatusIcon(analysis.status)} {analysis.status}
                          </span>

                          {analysis.aiConfidence && (
                            <div className="text-right">
                              <p className="text-xs text-slate-500">AI Confidence</p>
                              <p className="text-sm font-semibold text-slate-900">
                                {analysis.aiConfidence}%
                              </p>
                            </div>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExport(analysis);
                            }}
                            className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700 font-medium"
                          >
                            Export
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 py-6">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg transition-colors ${
                          page === currentPage
                            ? 'bg-emerald-500 text-white'
                            : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedAnalysis && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedAnalysis(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Analysis Details</h2>
                      <p className="text-sm text-slate-600 mt-1">
                        ID: {selectedAnalysis._id}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedAnalysis(null)}
                      className="text-2xl text-slate-400 hover:text-slate-600"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Job Text */}
                    {selectedAnalysis.jobText && (
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Job Description</h3>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">
                          {selectedAnalysis.jobText}
                        </p>
                      </div>
                    )}

                    {/* Risk Score */}
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Risk Assessment</h3>
                      <RiskBar score={selectedAnalysis.riskScore} />
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-slate-600">Rule-Based Score</p>
                          <p className="font-semibold text-slate-900">
                            {selectedAnalysis.breakdown?.ruleBasedScore}
                          </p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-slate-600">AI Score</p>
                          <p className="font-semibold text-slate-900">
                            {selectedAnalysis.breakdown?.aiScore}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Reasons */}
                    {selectedAnalysis.reasons && selectedAnalysis.reasons.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Findings</h3>
                        <ul className="space-y-2">
                          {selectedAnalysis.reasons.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                              <span className="text-emerald-500 font-bold">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-2 text-sm pt-4 border-t border-slate-200">
                      <div>
                        <p className="text-slate-600">Status</p>
                        <p className="font-semibold text-slate-900">{selectedAnalysis.status}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Analyzed</p>
                        <p className="font-semibold text-slate-900">
                          {formatDate(selectedAnalysis.createdAt)}
                        </p>
                      </div>
                      {selectedAnalysis.aiConfidence && (
                        <div>
                          <p className="text-slate-600">AI Confidence</p>
                          <p className="font-semibold text-slate-900">
                            {selectedAnalysis.aiConfidence}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-6 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => handleExport(selectedAnalysis)}
                      className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium"
                    >
                      Export as JSON
                    </button>
                    <button
                      onClick={() => setSelectedAnalysis(null)}
                      className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default History;
