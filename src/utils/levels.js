import { LEVELS } from '../data/levels.js';

export function getLevelInfo(xp) {
  const safeXp =
    typeof xp === 'number' && Number.isFinite(xp) && xp > 0
      ? Math.floor(xp)
      : 0;

  let currentIndex = 0;
  for (let i = 0; i < LEVELS.length; i += 1) {
    if (safeXp >= LEVELS[i].min) {
      currentIndex = i;
    } else {
      break;
    }
  }

  const current = LEVELS[currentIndex];
  const next = currentIndex < LEVELS.length - 1 ? LEVELS[currentIndex + 1] : null;

  if (!next) {
    return {
      level: current.level,
      name: current.name,
      currentXp: safeXp,
      levelMinXp: current.min,
      nextLevelXp: null,
      nextLevelName: null,
      xpIntoLevel: safeXp - current.min,
      xpToNext: 0,
      progressPercent: 100,
      isMaxLevel: true,
    };
  }

  const span = Math.max(1, next.min - current.min);
  const xpIntoLevel = Math.max(0, safeXp - current.min);
  const xpToNext = Math.max(0, next.min - safeXp);
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((xpIntoLevel / span) * 100))
  );

  return {
    level: current.level,
    name: current.name,
    currentXp: safeXp,
    levelMinXp: current.min,
    nextLevelXp: next.min,
    nextLevelName: next.name,
    xpIntoLevel,
    xpToNext,
    progressPercent,
    isMaxLevel: false,
  };
}
