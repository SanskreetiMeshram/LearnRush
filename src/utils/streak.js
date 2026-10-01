import { getLocalDateKey, getYesterdayDateKey } from './dates.js';

/**
 * Returns the effective streak to display in the UI.
 * If lastActiveDate is today or yesterday, the saved streak is still active.
 * If lastActiveDate is null or older than yesterday, display 0 without mutating stored data.
 */
export function getEffectiveStreak(streak, lastActiveDate, now = new Date()) {
  const safeStreak =
    typeof streak === 'number' && Number.isFinite(streak) && streak > 0
      ? Math.floor(streak)
      : 0;
  if (!lastActiveDate || typeof lastActiveDate !== 'string') return 0;

  const todayKey = getLocalDateKey(now);
  const yesterdayKey = getYesterdayDateKey(now);

  if (lastActiveDate === todayKey || lastActiveDate === yesterdayKey) {
    return safeStreak;
  }

  return 0;
}

/**
 * Computes the updated streak and lastActiveDate when a student completes a quiz.
 * - lastActiveDate is today -> streak unchanged (at least 1)
 * - lastActiveDate is yesterday -> streak + 1
 * - Otherwise (null or older) -> streak = 1
 */
export function computeCompletedQuizStreak(currentStreak, lastActiveDate, now = new Date()) {
  const todayKey = getLocalDateKey(now);
  const yesterdayKey = getYesterdayDateKey(now);
  const safeStreak =
    typeof currentStreak === 'number' && Number.isFinite(currentStreak) && currentStreak > 0
      ? Math.floor(currentStreak)
      : 0;

  if (lastActiveDate === todayKey) {
    return {
      streak: Math.max(1, safeStreak),
      lastActiveDate: todayKey,
    };
  }

  if (lastActiveDate === yesterdayKey) {
    return {
      streak: safeStreak + 1,
      lastActiveDate: todayKey,
    };
  }

  return {
    streak: 1,
    lastActiveDate: todayKey,
  };
}
