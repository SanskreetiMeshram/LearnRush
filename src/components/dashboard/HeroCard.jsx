import React from 'react';
import { Rocket, Sparkles } from 'lucide-react';
import XPBadge, { LevelBadge } from '../ui/XPBadge.jsx';
import StreakBadge from '../ui/StreakBadge.jsx';
import ProgressBar from '../ui/ProgressBar.jsx';
import Button from '../ui/Button.jsx';

export default function HeroCard({ xp = 0, levelInfo, streak = 0 }) {
  const {
    level = 1,
    name = 'Beginner',
    xpToNext = 500,
    progressPercent = 0,
    isMaxLevel = false,
    levelMinXp = 0,
    nextLevelXp = 500,
  } = levelInfo || {};

  return (
    <section
      aria-label="Your current level and challenge status"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-lavender-bg via-white to-sky-bg p-6 sm:p-8 border border-violet-200/80 shadow-soft"
    >
      {/* Decorative soft background shapes */}
      <div
        className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full bg-lavender/10 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-sky/10 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1 min-w-0">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <LevelBadge level={level} name={name} />
            <XPBadge xp={xp} />
            <StreakBadge days={streak} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Ready for today&apos;s challenge? 🚀
          </h2>
          <p className="text-body font-medium mt-1.5 text-base sm:text-lg">
            {isMaxLevel ? (
              <span className="font-bold text-lavender-dark">
                Max level reached 🎉
              </span>
            ) : (
              <>
                You&apos;re only{' '}
                <span className="font-extrabold text-lavender-dark">
                  {xpToNext} XP
                </span>{' '}
                away from Level {level + 1}.
              </>
            )}
          </p>

          {/* Progress Bar toward next level */}
          <div className="mt-5 max-w-xl">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-ink mb-2">
              <span>
                Level {level}: {name}
              </span>
              <span>
                {isMaxLevel
                  ? `${xp} XP (Max Level)`
                  : `${xp} / ${nextLevelXp} XP (${progressPercent}%)`}
              </span>
            </div>
            <ProgressBar
              value={progressPercent}
              max={100}
              label={`Level ${level} progress`}
              height="h-3.5"
              trackColor="bg-white/90 border border-violet-200/70"
              color="bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500"
              animate
              duration={0.9}
            />
            {!isMaxLevel && (
              <div className="flex justify-between text-[11px] font-semibold text-body mt-1">
                <span>{levelMinXp} XP</span>
                <span>Next: Level {level + 1} ({nextLevelXp} XP)</span>
              </div>
            )}
          </div>
        </div>

        {/* Action CTA */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
          <Button to="/challenge" size="lg" variant="primary">
            <Rocket className="w-5 h-5" aria-hidden="true" />
            <span>Start Challenge</span>
          </Button>
          <p className="text-xs font-semibold text-body flex items-center justify-center lg:justify-end gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            <span>+100 XP per correct answer</span>
          </p>
        </div>
      </div>
    </section>
  );
}
