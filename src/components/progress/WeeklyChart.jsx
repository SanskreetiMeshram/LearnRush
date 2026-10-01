import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getLast7Days } from '../../utils/dates.js';

export default function WeeklyChart({ dailyStats = {} }) {
  const shouldReduceMotion = useReducedMotion();
  const days = getLast7Days();

  const data = days.map((day) => {
    const entry = dailyStats?.[day.dateKey] || { answered: 0, correct: 0, xp: 0 };
    return {
      ...day,
      answered: entry.answered || 0,
      correct: entry.correct || 0,
      xp: entry.xp || 0,
    };
  });

  const totalWeekAnswered = data.reduce((sum, d) => sum + d.answered, 0);
  const maxAnswered = Math.max(10, ...data.map((d) => d.answered));

  return (
    <section
      aria-label="Weekly Learning Activity"
      className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-card"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-ink">
            Weekly Learning Activity 📅
          </h2>
          <p className="text-sm font-medium text-body mt-0.5">
            Questions answered over the last 7 days
          </p>
        </div>
        <span className="inline-flex items-center self-start sm:self-auto px-3 py-1 rounded-full text-xs font-extrabold bg-lavender-bg text-lavender-dark border border-violet-200">
          {totalWeekAnswered} {totalWeekAnswered === 1 ? 'question' : 'questions'} this week
        </span>
      </div>

      {totalWeekAnswered === 0 && (
        <div className="mb-4 rounded-2xl bg-sky-light/70 px-4 py-3 border border-blue-100 text-sm font-semibold text-body">
          No questions answered in the last 7 days yet — play a challenge today to light up your weekly chart! ✨
        </div>
      )}

      {/* Visual Bar Chart */}
      <div
        className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 pt-6 pb-2 px-1 sm:px-2"
        aria-hidden="true"
      >
        {data.map((day) => {
          const heightPercent =
            day.answered > 0
              ? Math.max(14, Math.min(100, Math.round((day.answered / maxAnswered) * 100)))
              : 6;

          return (
            <div
              key={day.dateKey}
              className="flex flex-col items-center justify-end h-full group"
            >
              {/* Value label above bar */}
              <span
                className={`text-xs font-extrabold mb-1.5 ${
                  day.answered > 0 ? 'text-ink' : 'text-slate-400'
                }`}
              >
                {day.answered}
              </span>

              {/* Bar Track */}
              <div className="w-full max-w-[42px] h-32 rounded-2xl bg-slate-100/90 flex items-end p-1 overflow-hidden border border-slate-200/60">
                <motion.div
                  initial={
                    shouldReduceMotion ? { height: `${heightPercent}%` } : { height: '0%' }
                  }
                  animate={{ height: `${heightPercent}%` }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 0.7, ease: 'easeOut' }
                  }
                  className={`w-full rounded-xl ${
                    day.isToday
                      ? 'bg-gradient-to-t from-blue-500 to-violet-500 shadow-xs'
                      : day.answered > 0
                      ? 'bg-sky/80'
                      : 'bg-slate-200'
                  }`}
                />
              </div>

              {/* Weekday Label */}
              <span
                className={`mt-2 text-xs font-extrabold ${
                  day.isToday
                    ? 'px-2 py-0.5 rounded-full bg-lavender-bg text-lavender-dark'
                    : 'text-body'
                }`}
              >
                {day.dayShort}
              </span>
            </div>
          );
        })}
      </div>

      {/* Screen-reader Accessible Alternative List */}
      <ul className="sr-only">
        {data.map((day) => (
          <li key={day.dateKey}>
            {day.dayFull} ({day.monthDay}
            {day.isToday ? ', Today' : ''}): {day.answered} questions answered,{' '}
            {day.correct} correct, {day.xp} XP earned.
          </li>
        ))}
      </ul>
    </section>
  );
}
