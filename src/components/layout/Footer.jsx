import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200/70 bg-white/60 py-6 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-1">
        <p className="text-sm sm:text-base font-extrabold text-ink">
          LearnRush — Learn a little. Grow a lot. 🚀
        </p>
        <p className="text-xs sm:text-sm font-medium text-body">
          Built for learning and fun.
        </p>
      </div>
    </footer>
  );
}
