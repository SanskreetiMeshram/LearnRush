import { ACHIEVEMENTS } from '../data/achievements.js';
import { SUBJECTS } from '../data/subjects.js';

export const STORAGE_KEY = 'learnrush:v1';
const CURRENT_VERSION = 1;
const MAX_HISTORY_ENTRIES = 50;

let memoryFallbackState = null;

export function getDefaultProgress() {
  const achievements = {};
  for (const item of ACHIEVEMENTS) {
    achievements[item.id] = { unlocked: false, unlockedAt: null };
  }

  const subjectStats = {};
  for (const subj of SUBJECTS) {
    subjectStats[subj.name] = { answered: 0, correct: 0 };
  }

  return {
    version: CURRENT_VERSION,
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    totalQuestions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    bestAnswerStreak: 0,
    currentAnswerStreak: 0,
    subjectStats,
    dailyStats: {},
    completedQuizzes: 0,
    achievements,
    quizHistory: [],
    lastResult: null,
  };
}

function sanitizeNonNegativeInt(val, fallback = 0) {
  if (typeof val === 'number' && Number.isFinite(val) && val >= 0) {
    return Math.floor(val);
  }
  return fallback;
}

function sanitizeProgressState(raw) {
  const defaults = getDefaultProgress();
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return defaults;
  }

  if (raw.version !== CURRENT_VERSION) {
    return defaults;
  }

  const subjectStats = { ...defaults.subjectStats };
  if (raw.subjectStats && typeof raw.subjectStats === 'object') {
    for (const subj of SUBJECTS) {
      const entry = raw.subjectStats[subj.name];
      if (entry && typeof entry === 'object') {
        const answered = sanitizeNonNegativeInt(entry.answered, 0);
        const correct = Math.min(answered, sanitizeNonNegativeInt(entry.correct, 0));
        subjectStats[subj.name] = { answered, correct };
      }
    }
  }

  const dailyStats = {};
  if (raw.dailyStats && typeof raw.dailyStats === 'object' && !Array.isArray(raw.dailyStats)) {
    for (const [dateKey, stats] of Object.entries(raw.dailyStats)) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateKey) && stats && typeof stats === 'object') {
        dailyStats[dateKey] = {
          answered: sanitizeNonNegativeInt(stats.answered, 0),
          correct: sanitizeNonNegativeInt(stats.correct, 0),
          xp: sanitizeNonNegativeInt(stats.xp, 0),
        };
      }
    }
  }

  const achievements = { ...defaults.achievements };
  if (raw.achievements && typeof raw.achievements === 'object') {
    for (const item of ACHIEVEMENTS) {
      const saved = raw.achievements[item.id];
      if (saved && typeof saved === 'object') {
        const unlocked = Boolean(saved.unlocked);
        achievements[item.id] = {
          unlocked,
          unlockedAt:
            unlocked && typeof saved.unlockedAt === 'string'
              ? saved.unlockedAt
              : null,
        };
      }
    }
  }

  const quizHistory = [];
  if (Array.isArray(raw.quizHistory)) {
    for (const entry of raw.quizHistory.slice(0, MAX_HISTORY_ENTRIES)) {
      if (entry && typeof entry === 'object' && typeof entry.subject === 'string') {
        quizHistory.push({
          id: entry.id || `${Date.now()}-${Math.random()}`,
          subject: entry.subject,
          correct: sanitizeNonNegativeInt(entry.correct, 0),
          total: sanitizeNonNegativeInt(entry.total, 10),
          accuracy: sanitizeNonNegativeInt(entry.accuracy, 0),
          xpEarned: sanitizeNonNegativeInt(entry.xpEarned, 0),
          date: typeof entry.date === 'string' ? entry.date : new Date().toISOString(),
        });
      }
    }
  }

  let lastResult = null;
  if (
    raw.lastResult &&
    typeof raw.lastResult === 'object' &&
    typeof raw.lastResult.subject === 'string'
  ) {
    lastResult = {
      id: raw.lastResult.id || 'last-result',
      subject: raw.lastResult.subject,
      correct: sanitizeNonNegativeInt(raw.lastResult.correct, 0),
      incorrect: sanitizeNonNegativeInt(raw.lastResult.incorrect, 0),
      total: sanitizeNonNegativeInt(raw.lastResult.total, 10),
      accuracy: sanitizeNonNegativeInt(raw.lastResult.accuracy, 0),
      xpEarned: sanitizeNonNegativeInt(raw.lastResult.xpEarned, 0),
      date:
        typeof raw.lastResult.date === 'string'
          ? raw.lastResult.date
          : new Date().toISOString(),
      newlyUnlockedIds: Array.isArray(raw.lastResult.newlyUnlockedIds)
        ? raw.lastResult.newlyUnlockedIds.filter((id) => typeof id === 'string')
        : [],
    };
  }

  const lastActiveDate =
    typeof raw.lastActiveDate === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(raw.lastActiveDate)
      ? raw.lastActiveDate
      : null;

  return {
    version: CURRENT_VERSION,
    xp: sanitizeNonNegativeInt(raw.xp, 0),
    streak: sanitizeNonNegativeInt(raw.streak, 0),
    lastActiveDate,
    totalQuestions: sanitizeNonNegativeInt(raw.totalQuestions, 0),
    correctAnswers: sanitizeNonNegativeInt(raw.correctAnswers, 0),
    incorrectAnswers: sanitizeNonNegativeInt(raw.incorrectAnswers, 0),
    bestAnswerStreak: sanitizeNonNegativeInt(raw.bestAnswerStreak, 0),
    currentAnswerStreak: sanitizeNonNegativeInt(raw.currentAnswerStreak, 0),
    subjectStats,
    dailyStats,
    completedQuizzes: sanitizeNonNegativeInt(raw.completedQuizzes, 0),
    achievements,
    quizHistory,
    lastResult,
  };
}

export function loadProgress() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return memoryFallbackState
        ? sanitizeProgressState(memoryFallbackState)
        : getDefaultProgress();
    }
    const rawStr = window.localStorage.getItem(STORAGE_KEY);
    if (!rawStr) {
      return getDefaultProgress();
    }
    const parsed = JSON.parse(rawStr);
    const sanitized = sanitizeProgressState(parsed);
    memoryFallbackState = sanitized;
    return sanitized;
  } catch (err) {
    console.warn('[LearnRush] Failed to load progress from localStorage; falling back to defaults.', err);
    const defaults = getDefaultProgress();
    memoryFallbackState = defaults;
    return defaults;
  }
}

export function saveProgress(state) {
  const sanitized = sanitizeProgressState(state);
  memoryFallbackState = sanitized;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    }
  } catch (err) {
    console.warn('[LearnRush] Could not persist progress to localStorage.', err);
  }
  return sanitized;
}

export function updateProgress(updaterFn) {
  const current = loadProgress();
  const next = typeof updaterFn === 'function' ? updaterFn(current) : current;
  return saveProgress(next);
}

export function resetProgress() {
  const fresh = getDefaultProgress();
  memoryFallbackState = fresh;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.warn('[LearnRush] Could not remove progress key from localStorage.', err);
  }
  return fresh;
}
