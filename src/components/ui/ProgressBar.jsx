import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function ProgressBar({
  value = 0,
  max = 100,
  color = 'bg-gradient-to-r from-blue-500 to-violet-500',
  trackColor = 'bg-slate-100',
  label = 'Progress',
  height = 'h-3',
  animate = true,
  duration = 0.85,
  className = '',
}) {
  const shouldReduceMotion = useReducedMotion();
  const safeMax = max > 0 ? max : 100;
  const clampedValue = Math.min(safeMax, Math.max(0, Number(value) || 0));
  const percent = Math.min(100, Math.max(0, Math.round((clampedValue / safeMax) * 100)));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      className={`w-full ${trackColor} ${height} rounded-full overflow-hidden p-0.5 ${className}`.trim()}
    >
      <motion.div
        initial={animate && !shouldReduceMotion ? { width: '0%' } : false}
        animate={{ width: `${percent}%` }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration, ease: 'easeOut' }
        }
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}
