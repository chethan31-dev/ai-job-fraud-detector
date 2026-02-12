import React from 'react';
import { motion } from 'framer-motion';

const RiskBar = ({ score, showLabel = true }) => {
  // Determine color based on score
  const getColor = () => {
    if (score <= 30) return 'bg-emerald-500';
    if (score <= 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getStatus = () => {
    if (score <= 30) return 'Likely Legit';
    if (score <= 70) return 'Suspicious';
    return 'Potential Scam';
  };

  const getStatusColor = () => {
    if (score <= 30) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score <= 70) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="space-y-3">
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Risk Score</span>
          <span className="text-2xl font-bold text-slate-900">{score}/100</span>
        </div>
      )}
      
      <div className="relative w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full ${getColor()} rounded-full`}
        />
      </div>

      {showLabel && (
        <div className="flex justify-center">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}>
            {getStatus()}
          </span>
        </div>
      )}
    </div>
  );
};

export default RiskBar;
