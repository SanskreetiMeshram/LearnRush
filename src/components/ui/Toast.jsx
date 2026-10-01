import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Sparkles, Trophy, X } from 'lucide-react';

const TOAST_STYLES = {
  achievement: {
    bg: 'bg-sunny-light border-yellow-300 text-ink',
    iconBg: 'bg-sunny-bg text-amber-700',
    Icon: Trophy,
  },
  success: {
    bg: 'bg-mint-light border-emerald-300 text-ink',
    iconBg: 'bg-mint-bg text-emerald-700',
    Icon: CheckCircle2,
  },
  info: {
    bg: 'bg-white border-violet-200 text-ink',
    iconBg: 'bg-lavender-bg text-lavender-dark',
    Icon: Sparkles,
  },
};

export default function ToastContainer({ toasts = [], onDismiss }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2rem)] pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
          const IconComponent = style.Icon;

          return (
            <motion.div
              key={toast.id}
              role="status"
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.22 }}
              className={`pointer-events-auto flex items-center gap-3 p-3.5 rounded-2xl border shadow-lg ${style.bg}`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${style.iconBg}`}
                aria-hidden="true"
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-ink flex-1 break-words">
                {toast.message}
              </p>
              <button
                type="button"
                onClick={() => onDismiss?.(toast.id)}
                aria-label="Dismiss notification"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-ink hover:bg-black/5 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
