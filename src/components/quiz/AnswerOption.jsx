import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnswerOption({
  letter,
  text,
  state = 'idle',
  disabled = false,
  onSelect,
}) {
  let containerStyle =
    'bg-white border-slate-200 text-ink hover:border-violet-400 hover:bg-lavender-light/60 hover:shadow-md';
  let badgeStyle =
    'bg-lavender-bg text-lavender-dark border-violet-200 group-hover:bg-lavender group-hover:text-white';

  if (state === 'correct') {
    containerStyle =
      'bg-mint-bg border-emerald-500 text-emerald-950 shadow-sm ring-2 ring-emerald-300/60';
    badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
  } else if (state === 'incorrect') {
    containerStyle =
      'bg-rose-50 border-rose-400 text-rose-950 shadow-sm ring-2 ring-rose-200';
    badgeStyle = 'bg-rose-600 text-white border-rose-600';
  } else if (state === 'dimmed') {
    containerStyle =
      'bg-slate-50/80 border-slate-200 text-slate-500 opacity-65';
    badgeStyle = 'bg-slate-200 text-slate-600 border-slate-300';
  }

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      whileTap={!disabled ? { scale: 0.985 } : undefined}
      className={`group w-full min-h-[60px] sm:min-h-[64px] px-4 sm:px-5 py-3.5 rounded-2xl border-2 text-left transition-all duration-150 flex items-center justify-between gap-3.5 focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 ${containerStyle} ${
        disabled ? 'cursor-default' : 'cursor-pointer'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <span
          className={`w-9 h-9 rounded-xl border font-extrabold text-sm flex items-center justify-center shrink-0 transition-colors ${badgeStyle}`}
          aria-hidden="true"
        >
          {letter}
        </span>
        <span className="text-base sm:text-lg font-bold break-words leading-snug">
          {text}
        </span>
      </div>

      {/* Explicit Icon + Text Status Label (never color alone) */}
      {state === 'correct' && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-extrabold bg-emerald-600 text-white shrink-0 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>✓ Correct</span>
        </span>
      )}

      {state === 'incorrect' && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-extrabold bg-rose-600 text-white shrink-0 shadow-2xs">
          <XCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>✗ Incorrect</span>
        </span>
      )}
    </motion.button>
  );
}
