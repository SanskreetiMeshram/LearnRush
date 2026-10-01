import { VALIDATED_QUESTIONS } from '../data/questions.js';
import { SUBJECTS } from '../data/subjects.js';

export const XP_PER_CORRECT = 100;
export const XP_PER_INCORRECT = 10;
export const QUESTIONS_PER_QUIZ = 10;
export const DAILY_GOAL_QUESTIONS = 10;

/**
 * Pure Fisher–Yates shuffle returning a new array.
 */
export function shuffleArray(items) {
  if (!Array.isArray(items)) return [];
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

export function getQuestionsBySubject(subjectName) {
  if (!subjectName || typeof subjectName !== 'string') return [];
  const normalized = subjectName.trim().toLowerCase();
  return VALIDATED_QUESTIONS.filter(
    (q) => q.subject.toLowerCase() === normalized
  );
}

/**
 * Picks up to `count` unique questions for a subject using Fisher-Yates shuffle.
 * Keeps each question's options order stable so A/B/C/D matches the data.
 */
export function pickQuizQuestions(subjectName, count = QUESTIONS_PER_QUIZ) {
  const pool = getQuestionsBySubject(subjectName);
  if (pool.length === 0) return [];
  const shuffled = shuffleArray(pool);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getSubjectQuestionCounts() {
  const counts = {};
  for (const subj of SUBJECTS) {
    counts[subj.name] = getQuestionsBySubject(subj.name).length;
  }
  return counts;
}

export function calculateAccuracy(correct, total) {
  const safeTotal = Number(total) || 0;
  const safeCorrect = Number(correct) || 0;
  if (safeTotal <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((safeCorrect / safeTotal) * 100)));
}

export function getAccuracyMessage(accuracy) {
  if (accuracy >= 90) return 'Outstanding! 🌟';
  if (accuracy >= 70) return 'Great job! 👏';
  if (accuracy >= 50) return 'Good effort! 💪';
  return "Keep practicing, you've got this! 🚀";
}

export function getDailyGoalStatus(answeredToday = 0) {
  const safeAnswered = Math.max(0, Number(answeredToday) || 0);
  const dailyPercent = Math.min(
    100,
    Math.round((safeAnswered / DAILY_GOAL_QUESTIONS) * 100)
  );

  let message = 'Ready when you are!';
  if (dailyPercent >= 100) {
    message = 'Daily goal complete! 🎉';
  } else if (dailyPercent >= 50) {
    message = "You're doing great! Keep going.";
  } else if (dailyPercent >= 1) {
    message = 'Nice start! Keep going.';
  }

  return {
    dailyPercent,
    message,
    goal: DAILY_GOAL_QUESTIONS,
  };
}
