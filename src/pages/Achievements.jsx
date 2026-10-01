import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Lock, Sparkles, Trophy } from 'lucide-react';
import { ACHIEVEMENTS } from '../data/achievements.js';
import { useProgress } from '../context/ProgressContext.jsx';
import { formatReadableDate } from '../utils/dates.js';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import Button from '../components/ui/Button.jsx';

export function AchievementCard({
  achievement,
  unlocked = false,
  unlockedAt = null,
  progressText = '',
}) {
  const shouldReduceMotion = useReducedMotion();
  const formattedDate = unlockedAt ? formatReadableDate(unlockedAt) : '';

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.22 }}
      className={`rounded-3xl p-6 border-2 transition-all flex flex-col justify-between ${
        unlocked
          ? `${achievement.bgClass} shadow-card hover:shadow-card-hover`
          : 'bg-white/80 border-slate-200/90 opacity-65 shadow-xs'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <motion.div
            initial={unlocked && !shouldReduceMotion ? { scale: 0.8 } : false}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 16 }}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xs border ${
              unlocked
                ? 'bg-white border-white/80'
                : 'bg-slate-100 border-slate-200 grayscale'
            }`}
            aria-hidden="true"
          >
            {achievement.emoji}
          </motion.div>

          {unlocked ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Unlocked</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-slate-200 text-slate-700">
              <Lock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Locked</span>
            </span>
          )}
        </div>

        <h2 className="text-xl font-extrabold text-ink">{achievement.title}</h2>
        <p className="text-sm font-semibold text-body mt-1.5 leading-relaxed">
          {achievement.description}
        </p>
      </div>

      <div className="mt-5 pt-3.5 border-t border-black/10 flex items-center justify-between text-xs font-extrabold">
        {unlocked ? (
          <span className="text-emerald-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
            <span>
              {formattedDate ? `Unlocked on ${formattedDate}` : 'Unlocked!'}
            </span>
          </span>
        ) : (
          <span className="text-slate-600">{progressText}</span>
        )}
      </div>
    </motion.article>
  );
}

export default function Achievements() {
  const { progress } = useProgress();

  const totalCount = ACHIEVEMENTS.length;
  const unlockedCount = ACHIEVEMENTS.filter(
    (ach) => progress.achievements?.[ach.id]?.unlocked
  ).length;
  const percent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="space-y-8">
      {/* Header & Overall Unlock Progress */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-sunny-bg text-amber-900 border border-yellow-300 mb-2.5">
              <Trophy className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
              <span>Trophy Room</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
              Your Achievements
            </h1>
            <p className="text-sm sm:text-base font-medium text-body mt-1">
              Complete challenges, build streaks, and earn XP to collect every badge.
            </p>
          </div>

          <div className="bg-lavender-light px-5 py-3.5 rounded-2xl border border-violet-200 text-center shrink-0">
            <p className="text-2xl font-extrabold text-ink">
              {unlockedCount} of {totalCount} unlocked
            </p>
            <p className="text-xs font-bold text-lavender-dark mt-0.5">
              {percent}% Complete
            </p>
          </div>
        </div>

        <ProgressBar
          value={unlockedCount}
          max={totalCount}
          label={`${unlockedCount} of ${totalCount} achievements unlocked`}
          height="h-3.5"
          color="bg-gradient-to-r from-amber-400 via-orange-400 to-violet-500"
          animate
        />
      </div>

      {/* Zero-Unlocked Friendly Banner */}
      {unlockedCount === 0 && (
        <div className="rounded-3xl bg-gradient-to-r from-sunny-light via-white to-lavender-light p-6 border border-yellow-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl bg-sunny-bg border border-yellow-300 flex items-center justify-center text-3xl shrink-0"
              aria-hidden="true"
            >
              🏆
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-ink">
                Your trophy shelf is waiting! 🏆
              </h2>
              <p className="text-sm sm:text-base font-medium text-body mt-0.5">
                Finish your first 10-question quiz to unlock the First Challenge badge right away.
              </p>
            </div>
          </div>
          <Button to="/challenge" variant="primary" className="shrink-0">
            Start Challenge
          </Button>
        </div>
      )}

      {/* 6 Achievement Cards Grid */}
      <section aria-label="Achievements list">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ACHIEVEMENTS.map((ach) => {
            const saved = progress.achievements?.[ach.id] || {
              unlocked: false,
              unlockedAt: null,
            };
            const progressText = ach.getProgressText(progress);

            return (
              <AchievementCard
                key={ach.id}
                achievement={ach}
                unlocked={Boolean(saved.unlocked)}
                unlockedAt={saved.unlockedAt}
                progressText={progressText}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
