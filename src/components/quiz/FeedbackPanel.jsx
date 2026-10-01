import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { XP_PER_CORRECT, XP_PER_INCORRECT } from '../../utils/quiz.js';

export default function FeedbackPanel({
  isCorrect,
  correctOptionText,
  explanation,
  isLastQuestion,
  onNext,
  nextButtonRef,
}) {
  const shouldReduceMotion = useReducedMotion();
  const xpGain = isCorrect ? XP_PER_CORRECT : XP_PER_INCORRECT;

  return (
    <motion.div
      role="region"
      aria-label="Answer feedback"
      aria-live="polite"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`mt-6 rounded-3xl p-5 sm:p-6 border-2 shadow-sm ${
        isCorrect
          ? 'bg-mint-light border-emerald-300 text-ink'
          : 'bg-peach-light border-orange-300 text-ink'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <motion.span
            initial={shouldReduceMotion ? false : { scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 18 }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm sm:text-base font-extrabold ${
              isCorrect
                ? 'bg-mint-bg text-emerald-900 border border-emerald-300'
                : 'bg-peach-bg text-orange-900 border border-orange-300'
            }`}
          >
            {isCorrect ? '🎉 Correct!' : '💡 Not quite!'}
          </motion.span>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-extrabold bg-sunny-bg text-amber-900 border border-yellow-300 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
            <span>+{xpGain} XP</span>
          </span>
        </div>

        <button
          ref={nextButtonRef}
          type="button"
          onClick={onNext}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-2xl font-extrabold text-base bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-sm hover:brightness-105 hover:-translate-y-0.5 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 shrink-0"
        >
          <span>{isLastQuestion ? 'See Results' : 'Next Question'}</span>
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3.5 space-y-1.5 text-sm sm:text-base">
        {!isCorrect && (
          <p className="font-bold text-ink">
            The correct answer is{' '}
            <span className="underline decoration-emerald-500 decoration-2 underline-offset-2">
              {correctOptionText}
            </span>
            .
          </p>
        )}
        <p className="text-body font-medium leading-relaxed">{explanation}</p>
      </div>
    </motion.div>
  );
}
