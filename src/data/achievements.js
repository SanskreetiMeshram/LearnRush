export const ACHIEVEMENTS = [
  {
    id: 'firstChallenge',
    emoji: '🏆',
    title: 'First Challenge',
    description: 'Complete your very first 10-question quiz challenge.',
    bgClass: 'bg-sunny-bg border-yellow-300',
    badgeClass: 'bg-yellow-100 text-yellow-800',
    check: (state) => (state?.completedQuizzes || 0) >= 1,
    getProgressText: (state) => {
      const done = Math.min(1, state?.completedQuizzes || 0);
      return `${done} / 1 challenge completed`;
    },
  },
  {
    id: 'hotStreak',
    emoji: '🔥',
    title: 'Hot Streak',
    description: 'Answer 5 questions correctly in a row.',
    bgClass: 'bg-peach-bg border-orange-300',
    badgeClass: 'bg-orange-100 text-orange-800',
    check: (state) => (state?.bestAnswerStreak || 0) >= 5,
    getProgressText: (state) => {
      const best = Math.min(5, state?.bestAnswerStreak || 0);
      return `Best run: ${best} / 5 in a row`;
    },
  },
  {
    id: 'quizMaster',
    emoji: '🧠',
    title: 'Quiz Master',
    description: 'Finish any quiz challenge with at least 90% accuracy.',
    bgClass: 'bg-lavender-bg border-violet-300',
    badgeClass: 'bg-violet-100 text-violet-800',
    check: (state, lastQuiz) => {
      if (lastQuiz && lastQuiz.accuracy >= 90) return true;
      const history = Array.isArray(state?.quizHistory) ? state.quizHistory : [];
      return history.some((entry) => (entry?.accuracy || 0) >= 90);
    },
    getProgressText: (state) => {
      const history = Array.isArray(state?.quizHistory) ? state.quizHistory : [];
      const bestAccuracy = history.reduce(
        (max, item) => Math.max(max, item?.accuracy || 0),
        0
      );
      return bestAccuracy > 0
        ? `Best score: ${bestAccuracy}% / 90% accuracy`
        : 'Goal: 90%+ accuracy in a quiz';
    },
  },
  {
    id: 'explorer',
    emoji: '🌍',
    title: 'Explorer',
    description: 'Complete a full Geography challenge.',
    bgClass: 'bg-mint-bg border-emerald-300',
    badgeClass: 'bg-emerald-100 text-emerald-800',
    check: (state, lastQuiz) => {
      if (lastQuiz && lastQuiz.subject === 'Geography') return true;
      const history = Array.isArray(state?.quizHistory) ? state.quizHistory : [];
      return history.some((entry) => entry?.subject === 'Geography');
    },
    getProgressText: (state) => {
      const history = Array.isArray(state?.quizHistory) ? state.quizHistory : [];
      const done = history.some((entry) => entry?.subject === 'Geography') ? 1 : 0;
      return `${done} / 1 Geography quiz completed`;
    },
  },
  {
    id: 'knowledgeSeeker',
    emoji: '📚',
    title: 'Knowledge Seeker',
    description: 'Answer a total of 50 questions across any subjects.',
    bgClass: 'bg-sky-bg border-blue-300',
    badgeClass: 'bg-blue-100 text-blue-800',
    check: (state) => (state?.totalQuestions || 0) >= 50,
    getProgressText: (state) => {
      const count = Math.min(50, state?.totalQuestions || 0);
      return `${count} / 50 questions answered`;
    },
  },
  {
    id: 'xpHunter',
    emoji: '⭐',
    title: 'XP Hunter',
    description: 'Reach 1,000 total XP from learning challenges.',
    bgClass: 'bg-pink-bg border-pink-300',
    badgeClass: 'bg-pink-100 text-pink-800',
    check: (state) => (state?.xp || 0) >= 1000,
    getProgressText: (state) => {
      const xp = Math.min(1000, state?.xp || 0);
      return `${xp} / 1000 XP earned`;
    },
  },
];
