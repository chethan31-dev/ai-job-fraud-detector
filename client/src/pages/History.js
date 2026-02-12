import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getHistory, deleteAnalysis } from '../services/api';
import RiskBar from '../components/RiskBar';

const History = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchHistory(1);
  }, []);

  const fetchHistory = async (page) => {
    setLoading(true);
    try {
      const response = await getHistory(page, 10);
      setAnalyses(response.data.analyses);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) return;

    try {
      await deleteAnalysis(id);
      fetchHistory(pagination.page);
    } catch (error) {
      console.error('Error deleting analysis:', error);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Analysis History</h1>
            <p className="text-slate-600 mt-1">
              View all your previous job posting analyses
            </p>
          </div>
          <div className="text-sm text-slate-600">
            Total: <span className="font-semibold">{pagination.total}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : analyses.length === 0 ? (
            <div className="text-center py-12 text-slate-600">
              No analyses yet
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {analyses.map((analysis) => (
                <div key={analysis._id} className="p-6 hover:bg-slate-50 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="mb-2 text-sm text-slate-500">
                        {formatDate(analysis.createdAt)}
                      </div>
                      <p className="text-sm text-slate-700 line-clamp-2">
                        {analysis.jobText || analysis.extractedImageText || 'Image-only analysis'}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleExpand(analysis._id)}
                        className="text-sm text-blue-600"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleDelete(analysis._id)}
                        className="text-sm text-rose-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 max-w-md">
                    <RiskBar score={analysis.riskScore} showLabel={false} />
                  </div>

                  {expandedId === analysis._id && (
                    <div className="mt-4 p-4 bg-slate-50 rounded">
                      {analysis.reasons?.map((reason, i) => (
                        <p key={i} className="text-sm text-slate-700 mb-2">
                          {i + 1}. {reason}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default History;
