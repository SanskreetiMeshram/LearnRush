import React from 'react';
import { motion } from 'framer-motion';

const TONE_STYLES = {
  lavender: {
    iconBg: 'bg-lavender-bg text-lavender-dark',
    border: 'border-violet-100',
  },
  sky: {
    iconBg: 'bg-sky-bg text-sky-dark',
    border: 'border-blue-100',
  },
  mint: {
    iconBg: 'bg-mint-bg text-mint-dark',
    border: 'border-emerald-100',
  },
  peach: {
    iconBg: 'bg-peach-bg text-peach-dark',
    border: 'border-orange-100',
  },
  sunny: {
    iconBg: 'bg-sunny-bg text-amber-800',
    border: 'border-yellow-200',
  },
  pink: {
    iconBg: 'bg-pink-bg text-pink-dark',
    border: 'border-pink-100',
  },
};

export default function StatCard({
  icon: Icon,
  emoji,
  label,
  value,
  hint,
  tone = 'lavender',
}) {
  const style = TONE_STYLES[tone] || TONE_STYLES.lavender;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-2xl p-4 sm:p-5 border ${style.border} shadow-card flex items-start gap-3.5 transition-shadow hover:shadow-card-hover`}
    >
      <div
        className={`w-11 h-11 rounded-2xl ${style.iconBg} flex items-center justify-center shrink-0 text-xl font-bold`}
        aria-hidden="true"
      >
        {Icon ? <Icon className="w-5 h-5" /> : emoji || '✨'}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm font-bold text-body leading-snug">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-ink mt-0.5 break-words">
          {value}
        </p>
        {hint && (
          <p className="text-xs font-medium text-slate-500 mt-1 leading-snug">
            {hint}
          </p>
        )}
      </div>
    </motion.div>
  );
}
