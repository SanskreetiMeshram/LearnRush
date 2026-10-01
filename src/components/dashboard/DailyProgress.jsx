import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, HelpCircle, Sparkles, Target } from 'lucide-react';
import {
  calculateAccuracy,
  DAILY_GOAL_QUESTIONS,
  getDailyGoalStatus,
} from '../../utils/quiz.js';

export default function DailyProgress({ todayStats }) {
  const shouldReduceMotion = useReducedMotion();
  const answered = todayStats?.answered || 0;
  const correct = todayStats?.correct || 0;
  const xp = todayStats?.xp || 0;

  const { dailyPercent, message } = getDailyGoalStatus(answered);
  const accuracyDisplay =
    answered > 0 ? `${calculateAccuracy(correct, answered)}%` : '—';

  // SVG Ring geometry
  const size = 148;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (dailyPercent / 100) * circumference;

  return (
    <section
      aria-label="Daily learning goal progress"
      className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-card"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-ink">
            Daily Learning Goal 🎯
          </h2>
          <p className="text-sm font-medium text-body mt-0.5">
            Complete {DAILY_GOAL_QUESTIONS} questions a day to build your habit
          </p>
        </div>
        <span className="inline-flex items-center self-start sm:self-auto px-3.5 py-1.5 rounded-full text-sm font-extrabold bg-mint-bg text-mint-dark border border-emerald-200">
          {message}
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
        {/* Animated SVG Circular Ring */}
        <div
          className="relative flex items-center justify-center shrink-0"
          role="progressbar"
          aria-label="Daily goal completion percentage"
          aria-valuenow={dailyPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="-rotate-90 transform"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#EAE4FF"
              strokeWidth={strokeWidth}
            />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="url(#dailyRingGradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={
                shouldReduceMotion
                  ? { strokeDashoffset }
                  : { strokeDashoffset: circumference }
              }
              animate={{ strokeDashoffset }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.9, ease: 'easeOut' }
              }
            />
            <defs>
              <linearGradient
                id="dailyRingGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#7C5CFC" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-ink leading-none">
              {dailyPercent}%
            </span>
            <span className="text-xs font-bold text-body mt-1">
              {Math.min(answered, DAILY_GOAL_QUESTIONS)} / {DAILY_GOAL_QUESTIONS}
            </span>
          </div>
        </div>

        {/* 4 Mini Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full flex-1">
          <div className="rounded-2xl bg-sky-light p-4 border border-blue-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-dark">
              <HelpCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Answered Today</span>
            </div>
            <p className="text-2xl font-extrabold text-ink mt-1.5">
              {answered}
            </p>
            <p className="text-xs font-semibold text-body mt-0.5">
              Goal: {DAILY_GOAL_QUESTIONS}
            </p>
          </div>

          <div className="rounded-2xl bg-mint-light p-4 border border-emerald-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-mint-dark">
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Correct Today</span>
            </div>
            <p className="text-2xl font-extrabold text-ink mt-1.5">{correct}</p>
            <p className="text-xs font-semibold text-body mt-0.5">
              Right answers
            </p>
          </div>

          <div className="rounded-2xl bg-lavender-light p-4 border border-violet-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-lavender-dark">
              <Target className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Accuracy Today</span>
            </div>
            <p className="text-2xl font-extrabold text-ink mt-1.5">
              {accuracyDisplay}
            </p>
            <p className="text-xs font-semibold text-body mt-0.5">
              Daily precision
            </p>
          </div>

          <div className="rounded-2xl bg-sunny-light p-4 border border-yellow-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
              <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>XP Today</span>
            </div>
            <p className="text-2xl font-extrabold text-ink mt-1.5">+{xp} XP</p>
            <p className="text-xs font-semibold text-body mt-0.5">
              Points earned
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
