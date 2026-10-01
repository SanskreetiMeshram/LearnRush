import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ACHIEVEMENTS } from '../data/achievements.js';
import { getLocalDateKey } from '../utils/dates.js';
import { getLevelInfo } from '../utils/levels.js';
import {
  calculateAccuracy,
  XP_PER_CORRECT,
  XP_PER_INCORRECT,
} from '../utils/quiz.js';
import {
  loadProgress,
  resetProgress as resetStorageProgress,
  saveProgress,
} from '../utils/storage.js';
import {
  computeCompletedQuizStreak,
  getEffectiveStreak,
} from '../utils/streak.js';
import { useToast } from './ToastContext.jsx';

const ProgressContext = createContext(null);

function evaluateAndUnlockAchievements(state, lastQuiz = null) {
  const nextAchievements = { ...state.achievements };
  const newlyUnlocked = [];
  const nowIso = new Date().toISOString();

  for (const ach of ACHIEVEMENTS) {
    const existing = nextAchievements[ach.id] || {
      unlocked: false,
      unlockedAt: null,
    };
    if (!existing.unlocked && ach.check(state, lastQuiz)) {
      nextAchievements[ach.id] = {
        unlocked: true,
        unlockedAt: nowIso,
      };
      newlyUnlocked.push(ach);
    }
  }

  return {
    achievements: nextAchievements,
    newlyUnlocked,
  };
}

export function ProgressProvider({ children }) {
  const { showToast } = useToast();
  const [progress, setProgress] = useState(() => loadProgress());
  const progressRef = useRef(progress);
  progressRef.current = progress;

  // Guard against duplicate recording in React StrictMode
  const processedAnswerKeysRef = useRef(new Set());
  const processedQuizIdsRef = useRef(new Set());

  const recordAnswer = useCallback(
    ({ subject, isCorrect, answerKey }) => {
      if (answerKey && processedAnswerKeysRef.current.has(answerKey)) {
        return { xpDelta: 0, newlyUnlockedIds: [] };
      }
      if (answerKey) {
        processedAnswerKeysRef.current.add(answerKey);
      }

      const current = progressRef.current;
      const xpDelta = isCorrect ? XP_PER_CORRECT : XP_PER_INCORRECT;
      const todayKey = getLocalDateKey();

      const nextCurrentAnswerStreak = isCorrect
        ? (current.currentAnswerStreak || 0) + 1
        : 0;
      const nextBestAnswerStreak = Math.max(
        current.bestAnswerStreak || 0,
        nextCurrentAnswerStreak
      );

      const prevSubject = current.subjectStats?.[subject] || {
        answered: 0,
        correct: 0,
      };
      const nextSubjectStats = {
        ...current.subjectStats,
        [subject]: {
          answered: prevSubject.answered + 1,
          correct: prevSubject.correct + (isCorrect ? 1 : 0),
        },
      };

      const prevDaily = current.dailyStats?.[todayKey] || {
        answered: 0,
        correct: 0,
        xp: 0,
      };
      const nextDailyStats = {
        ...current.dailyStats,
        [todayKey]: {
          answered: prevDaily.answered + 1,
          correct: prevDaily.correct + (isCorrect ? 1 : 0),
          xp: prevDaily.xp + xpDelta,
        },
      };

      const draftState = {
        ...current,
        xp: (current.xp || 0) + xpDelta,
        totalQuestions: (current.totalQuestions || 0) + 1,
        correctAnswers: (current.correctAnswers || 0) + (isCorrect ? 1 : 0),
        incorrectAnswers: (current.incorrectAnswers || 0) + (isCorrect ? 0 : 1),
        currentAnswerStreak: nextCurrentAnswerStreak,
        bestAnswerStreak: nextBestAnswerStreak,
        subjectStats: nextSubjectStats,
        dailyStats: nextDailyStats,
      };

      const { achievements, newlyUnlocked } =
        evaluateAndUnlockAchievements(draftState, null);

      const finalState = saveProgress({
        ...draftState,
        achievements,
      });

      progressRef.current = finalState;
      setProgress(finalState);

      for (const ach of newlyUnlocked) {
        showToast(`Achievement unlocked! 🏆 ${ach.title}`, 'achievement');
      }

      return {
        xpDelta,
        newlyUnlockedIds: newlyUnlocked.map((a) => a.id),
      };
    },
    [showToast]
  );

  const completeQuiz = useCallback(
    ({
      sessionId,
      subject,
      correct,
      total,
      xpEarned,
      unlockedDuringSession = [],
    }) => {
      if (sessionId && processedQuizIdsRef.current.has(sessionId)) {
        return progressRef.current.lastResult;
      }
      if (sessionId) {
        processedQuizIdsRef.current.add(sessionId);
      }

      const current = progressRef.current;
      const accuracy = calculateAccuracy(correct, total);
      const incorrect = Math.max(0, total - correct);
      const nowIso = new Date().toISOString();

      const { streak: nextStreak, lastActiveDate: nextActiveDate } =
        computeCompletedQuizStreak(current.streak, current.lastActiveDate);

      const historyEntry = {
        id: sessionId || `quiz-${Date.now()}`,
        subject,
        correct,
        total,
        accuracy,
        xpEarned,
        date: nowIso,
      };

      const nextHistory = [historyEntry, ...(current.quizHistory || [])].slice(
        0,
        50
      );

      const draftState = {
        ...current,
        streak: nextStreak,
        lastActiveDate: nextActiveDate,
        completedQuizzes: (current.completedQuizzes || 0) + 1,
        quizHistory: nextHistory,
      };

      const { achievements, newlyUnlocked } = evaluateAndUnlockAchievements(
        draftState,
        historyEntry
      );

      const combinedUnlockedIds = Array.from(
        new Set([
          ...unlockedDuringSession,
          ...newlyUnlocked.map((a) => a.id),
        ])
      );

      const lastResult = {
        id: historyEntry.id,
        subject,
        correct,
        incorrect,
        total,
        accuracy,
        xpEarned,
        date: nowIso,
        newlyUnlockedIds: combinedUnlockedIds,
      };

      const finalState = saveProgress({
        ...draftState,
        achievements,
        lastResult,
      });

      progressRef.current = finalState;
      setProgress(finalState);

      for (const ach of newlyUnlocked) {
        showToast(`Achievement unlocked! 🏆 ${ach.title}`, 'achievement');
      }

      showToast('Challenge completed! Progress saved! 🎉', 'success');

      return lastResult;
    },
    [showToast]
  );

  const resetAll = useCallback(() => {
    processedAnswerKeysRef.current.clear();
    processedQuizIdsRef.current.clear();
    const fresh = resetStorageProgress();
    progressRef.current = fresh;
    setProgress(fresh);
    showToast('Progress reset', 'info');
  }, [showToast]);

  const effectiveStreak = useMemo(
    () => getEffectiveStreak(progress.streak, progress.lastActiveDate),
    [progress.streak, progress.lastActiveDate]
  );

  const levelInfo = useMemo(() => getLevelInfo(progress.xp), [progress.xp]);

  const todayKey = getLocalDateKey();
  const todayStats = useMemo(() => {
    const entry = progress.dailyStats?.[todayKey];
    return {
      answered: entry?.answered || 0,
      correct: entry?.correct || 0,
      xp: entry?.xp || 0,
    };
  }, [progress.dailyStats, todayKey]);

  const value = useMemo(
    () => ({
      progress,
      effectiveStreak,
      levelInfo,
      todayStats,
      recordAnswer,
      completeQuiz,
      resetAll,
    }),
    [
      progress,
      effectiveStreak,
      levelInfo,
      todayStats,
      recordAnswer,
      completeQuiz,
      resetAll,
    ]
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return ctx;
}
