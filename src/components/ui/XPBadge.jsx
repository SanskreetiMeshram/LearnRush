import React from 'react';
import { Sparkles, Award } from 'lucide-react';

export default function XPBadge({ xp = 0, size = 'md', className = '' }) {
  const safeXp = Math.max(0, Number(xp) || 0);
  const sizeClasses =
    size === 'sm'
      ? 'px-2.5 py-1 text-xs gap-1'
      : size === 'lg'
      ? 'px-4 py-2 text-base gap-2'
      : 'px-3 py-1.5 text-sm gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-extrabold rounded-full bg-sunny-bg text-amber-900 border border-yellow-300 shadow-sm ${sizeClasses} ${className}`.trim()}
      aria-label={`${safeXp} Experience Points`}
    >
      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
      <span>{safeXp.toLocaleString()} XP</span>
    </span>
  );
}

export function LevelBadge({ level = 1, name = 'Beginner', size = 'md', className = '' }) {
  const sizeClasses =
    size === 'sm'
      ? 'px-2.5 py-1 text-xs gap-1'
      : size === 'lg'
      ? 'px-4 py-2 text-base gap-2'
      : 'px-3 py-1.5 text-sm gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-extrabold rounded-full bg-lavender-bg text-lavender-dark border border-violet-200 shadow-sm ${sizeClasses} ${className}`.trim()}
      aria-label={`Level ${level}: ${name}`}
    >
      <Award className="w-4 h-4 text-lavender shrink-0" aria-hidden="true" />
      <span>
        Lvl {level} · {name}
      </span>
    </span>
  );
}
