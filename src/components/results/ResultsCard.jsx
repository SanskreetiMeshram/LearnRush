import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Award,
  BarChart3,
  CheckCircle2,
  Flame,
  Home,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import { ACHIEVEMENTS } from '../../data/achievements.js';
import { getSubjectByParam } from '../../data/subjects.js';
import { getAccuracyMessage } from '../../utils/quiz.js';
import Button from '../ui/Button.jsx';
import ProgressBar from '../ui/ProgressBar.jsx';

export default function ResultsCard({
  result,
  levelInfo,
  streak = 0,
  onPlayAgain,
  onDashboard,
  onViewProgress,
}) {
  const shouldReduceMotion = useReducedMotion();
  const [displayXp, setDisplayXp] = useState(0);

  const targetXp = result?.xpEarned || 0;

  useEffect(() => {
    if (shouldReduceMotion || targetXp <= 0) {
      setDisplayXp(targetXp);
      return undefined;
    }

    let start = 0;
    const durationMs = 650;
    const stepMs = 20;
    const totalSteps = Math.max(1, Math.floor(durationMs / stepMs));
    const increment = targetXp / totalSteps;

    const interval = setInterval(() => {
      start += increment;
      if (start >= targetXp) {
        setDisplayXp(targetXp);
        clearInterval(interval);
      } else {
        setDisplayXp(Math.round(start));
      }
    }, stepMs);

    return () => clearInterval(interval);
  }, [targetXp, shouldReduceMotion]);

  if (!result) return null;

  const subjectMeta = getSubjectByParam(result.subject);
  const accuracyMessage = getAccuracyMessage(result.accuracy);
  const newlyUnlocked = ACHIEVEMENTS.filter((a) =>
    (result.newlyUnlockedIds || []).includes(a.id)
  );

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-100 shadow-soft overflow-hidden relative">
      {/* Decorative soft header banner */}
      <div className="rounded-3xl bg-gradient-to-br from-lavender-bg via-white to-sky-bg p-6 sm:p-8 border border-violet-200/80 text-center">
        {subjectMeta && (
          <span
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs sm:text-sm font-extrabold border mb-3 ${subjectMeta.badgeClass}`}
          >
            <span>{subjectMeta.emoji}</span>
            <span>{subjectMeta.name} Challenge</span>
          </span>
        )}

        <h1 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
          Challenge Complete! 🎉
        </h1>
        <p className="text-base sm:text-lg font-bold text-lavender-dark mt-1.5">
          {accuracyMessage}
        </p>

        {/* Big Score & Accuracy Display */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <div className="bg-white/90 rounded-2xl px-6 py-4 border border-violet-100 shadow-xs min-w-[150px]">
            <p className="text-xs font-bold uppercase tracking-wider text-body">
              Final Score
            </p>
            <p className="text-3xl sm:text-4xl font-extrabold text-ink mt-1">
              {result.correct} / {result.total}
            </p>
          </div>

          <div className="bg-white/90 rounded-2xl px-6 py-4 border border-emerald-200 shadow-xs min-w-[150px]">
            <p className="text-xs font-bold uppercase tracking-wider text-body">
              Accuracy
            </p>
            <p className="text-3xl sm:text-4xl font-extrabold text-mint-dark mt-1">
              {result.accuracy}% Accuracy
            </p>
          </div>

          <div className="bg-sunny-bg rounded-2xl px-6 py-4 border border-yellow-300 shadow-xs min-w-[150px]">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
              XP Earned
            </p>
            <p
              className="text-3xl sm:text-4xl font-extrabold text-amber-950 mt-1 flex items-center justify-center gap-1"
              aria-label={`+${targetXp} XP earned`}
            >
              <Sparkles className="w-6 h-6 text-amber-600 shrink-0" aria-hidden="true" />
              <span>+{displayXp} XP</span>
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown Mini Cards: Total, Correct, Incorrect, Streak */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6">
        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/70 text-center">
          <p className="text-xs font-bold text-body">Total Questions</p>
          <p className="text-2xl font-extrabold text-ink mt-1">{result.total}</p>
        </div>

        <div className="rounded-2xl bg-mint-light p-4 border border-emerald-200 text-center">
          <p className="text-xs font-bold text-mint-dark flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            <span>Correct</span>
          </p>
          <p className="text-2xl font-extrabold text-ink mt-1">
            {result.correct}
          </p>
        </div>

        <div className="rounded-2xl bg-rose-50/70 p-4 border border-rose-200 text-center">
          <p className="text-xs font-bold text-rose-700 flex items-center justify-center gap-1">
            <XCircle className="w-4 h-4" aria-hidden="true" />
            <span>Incorrect</span>
          </p>
          <p className="text-2xl font-extrabold text-ink mt-1">
            {result.incorrect}
          </p>
        </div>

        <div className="rounded-2xl bg-peach-light p-4 border border-orange-200 text-center">
          <p className="text-xs font-bold text-orange-800 flex items-center justify-center gap-1">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-400" aria-hidden="true" />
            <span>Streak</span>
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-ink mt-1">
            🔥 {streak} Day Streak
          </p>
        </div>
      </div>

      {/* Level & Progress Bar */}
      {levelInfo && (
        <div className="mt-6 rounded-2xl bg-lavender-light/70 p-5 border border-violet-200/80">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-lavender shrink-0" aria-hidden="true" />
              <span className="text-base font-extrabold text-ink">
                Level {levelInfo.level}: {levelInfo.name}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-body">
              {levelInfo.isMaxLevel
                ? 'Max level reached 🎉'
                : `${levelInfo.xpToNext} XP to Level ${levelInfo.level + 1} (${levelInfo.nextLevelName})`}
            </span>
          </div>
          <ProgressBar
            value={levelInfo.progressPercent}
            max={100}
            label="Level progress"
            height="h-3"
            trackColor="bg-white border border-violet-100"
            color="bg-gradient-to-r from-blue-500 to-violet-500"
          />
        </div>
      )}

      {/* Newly Unlocked Achievements Section */}
      {newlyUnlocked.length > 0 && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl bg-sunny-light p-5 border-2 border-yellow-300"
        >
          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-base mb-3">
            <Trophy className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />
            <h2>Newly Unlocked Achievements!</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {newlyUnlocked.map((ach) => (
              <div
                key={ach.id}
                className="flex items-center gap-3 bg-white rounded-xl p-3.5 border border-yellow-300 shadow-2xs"
              >
                <span className="text-2xl shrink-0" aria-hidden="true">
                  {ach.emoji}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-ink truncate">
                    {ach.title}
                  </p>
                  <p className="text-xs font-medium text-body">
                    {ach.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5">
        <Button onClick={onPlayAgain} variant="primary" size="lg">
          <RotateCcw className="w-5 h-5" aria-hidden="true" />
          <span>Play Again</span>
        </Button>

        <Button onClick={onDashboard} variant="secondary" size="lg">
          <Home className="w-5 h-5" aria-hidden="true" />
          <span>Back to Dashboard</span>
        </Button>

        <Button onClick={onViewProgress} variant="secondary" size="lg">
          <BarChart3 className="w-5 h-5" aria-hidden="true" />
          <span>View Progress</span>
        </Button>
      </div>
    </div>
  );
}
