import React from 'react';
import Button from './Button.jsx';

export default function EmptyState({
  emoji = '🚀',
  title = 'Nothing here yet',
  message = 'Start your first learning challenge to see your stats grow!',
  actionLabel,
  onAction,
  actionTo,
}) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-card flex flex-col items-center justify-center text-center">
      <div
        className="w-16 h-16 rounded-2xl bg-lavender-light border border-violet-100 flex items-center justify-center text-3xl mb-4"
        aria-hidden="true"
      >
        {emoji}
      </div>
      <h3 className="text-lg sm:text-xl font-extrabold text-ink">{title}</h3>
      <p className="text-sm sm:text-base text-body mt-1.5 max-w-md">
        {message}
      </p>
      {(actionLabel && (onAction || actionTo)) && (
        <div className="mt-5">
          <Button to={actionTo} onClick={onAction} variant="primary">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
