import React from 'react';
import { Flame } from 'lucide-react';

export default function StreakBadge({
  days = 0,
  size = 'md',
  compact = false,
  className = '',
}) {
  const safeDays = Math.max(0, Number(days) || 0);
  const isActive = safeDays > 0;

  const sizeClasses =
    size === 'sm'
      ? 'px-2.5 py-1 text-xs gap-1'
      : size === 'lg'
      ? 'px-4 py-2 text-base gap-2'
      : 'px-3 py-1.5 text-sm gap-1.5';

  const colorClasses = isActive
    ? 'bg-peach-bg text-orange-900 border-orange-300'
    : 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <span
      className={`inline-flex items-center font-extrabold rounded-full border shadow-sm ${sizeClasses} ${colorClasses} ${className}`.trim()}
      aria-label={`${safeDays} day learning streak`}
    >
      <Flame
        className={`w-4 h-4 shrink-0 ${
          isActive ? 'text-orange-500 fill-orange-400' : 'text-slate-400'
        }`}
        aria-hidden="true"
      />
      <span>
        {compact
          ? `${safeDays}d`
          : `${safeDays} ${safeDays === 1 ? 'Day' : 'Days'}`}
      </span>
    </span>
  );
}
