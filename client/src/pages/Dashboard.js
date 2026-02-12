import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getHistory } from '../services/api';
import RiskBar from '../components/RiskBar';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [stats, setStats] = useState({ total: 0, legit: 0, suspicious: 0, fake: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getHistory(1, 5);
      const analyses = response.data.analyses;
      setRecentAnalyses(analyses);

      // Calculate stats
      const total = response.data.pagination.total;
      const legit = analyses.filter(a => a.status === 'Likely Legit').length;
      const suspicious = analyses.filter(a => a.status === 'Suspicious').length;
      const fake = analyses.filter(a => a.status === 'Potential Scam').length;

      setStats({ total, legit, suspicious, fake });
    } catch (error) {
      console.error('Error fetching data:', error);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name}!</h1>
          <p className="text-slate-600 mt-2">Analyze job postings and protect yourself from fraud</p>
        </div>

        {/* Quick Action */}
        <Link
          to="/analyze"
          className="block p-6 bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-sm transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Analyze New Job Posting</h3>
              <p className="text-emerald-100 mt-1">Upload or paste a job description to check for fraud</p>
            </div>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </Link>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Analyses</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Likely Legit</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.legit}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Suspicious</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{stats.suspicious}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Potential Scam</p>
                <p className="text-3xl font-bold text-rose-600 mt-2">{stats.fake}</p>
              </div>
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Analyses</h2>
            <Link to="/history" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            </div>
          ) : recentAnalyses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-600">No analyses yet</p>
              <Link to="/analyze" className="text-emerald-600 hover:text-emerald-700 font-medium mt-2 inline-block">
                Analyze your first job posting
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentAnalyses.map((analysis) => (
                <div key={analysis._id} className="p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-sm text-slate-500">{formatDate(analysis.createdAt)}</p>
                      <p className="text-sm text-slate-700 mt-1 line-clamp-2">
                        {analysis.jobText || analysis.extractedImageText || 'Image analysis'}
                      </p>
                    </div>
                  </div>
                  <RiskBar score={analysis.riskScore} showLabel={false} />
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      analysis.status === 'Likely Legit' ? 'bg-emerald-100 text-emerald-700' :
                      analysis.status === 'Suspicious' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {analysis.status}
                    </span>
                    <span className="text-xs text-slate-500">Score: {analysis.riskScore}/100</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
