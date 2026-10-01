import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoadingState({
  message = 'Preparing your challenge...',
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-card flex flex-col items-center justify-center text-center my-6"
    >
      <motion.div
        animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        className="w-16 h-16 rounded-2xl bg-lavender-bg text-lavender flex items-center justify-center mb-4 shadow-sm"
        aria-hidden="true"
      >
        <Sparkles className="w-8 h-8" />
      </motion.div>
      <p className="text-lg font-extrabold text-ink">{message}</p>
      <p className="text-sm text-body mt-1">
        Shuffling questions and setting up your board...
      </p>
    </div>
  );
}
