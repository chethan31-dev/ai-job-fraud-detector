import React from 'react';
import { motion } from 'framer-motion';

const ReasonsList = ({ reasons }) => {
  if (!reasons || reasons.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Detection details
      </h3>
      <div className="space-y-2">
        {reasons.map((reason, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3"
          >
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
              {index + 1}
            </div>
            <p className="flex-1 text-sm text-slate-700">{reason}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReasonsList;
