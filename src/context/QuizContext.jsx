import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getSubjectByParam } from '../data/subjects.js';
import {
  pickQuizQuestions,
  QUESTIONS_PER_QUIZ,
  XP_PER_CORRECT,
  XP_PER_INCORRECT,
} from '../utils/quiz.js';
import { useProgress } from './ProgressContext.jsx';

const QuizContext = createContext(null);

function createInitialSession() {
  return {
    sessionId: null,
    subject: null,
    questions: [],
    currentIndex: 0,
    answers: [],
    score: 0,
    xpEarned: 0,
    answerStreak: 0,
    selectedIndex: null,
    isAnswered: false,
    finished: false,
    unlockedDuringSession: [],
  };
}

export function QuizProvider({ children }) {
  const { recordAnswer, completeQuiz } = useProgress();
  const [session, setSession] = useState(createInitialSession);
  const sessionRef = useRef(session);
  sessionRef.current = session;

  const startQuiz = useCallback((subjectParam) => {
    const subjectMeta = getSubjectByParam(subjectParam);
    if (!subjectMeta) {
      return null;
    }

    const questions = pickQuizQuestions(subjectMeta.name, QUESTIONS_PER_QUIZ);
    const newSession = {
      sessionId: `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      subject: subjectMeta.name,
      questions,
      currentIndex: 0,
      answers: [],
      score: 0,
      xpEarned: 0,
      answerStreak: 0,
      selectedIndex: null,
      isAnswered: false,
      finished: false,
      unlockedDuringSession: [],
    };

    sessionRef.current = newSession;
    setSession(newSession);
    return newSession;
  }, []);

  const selectAnswer = useCallback(
    (optionIndex) => {
      const current = sessionRef.current;
      if (
        !current.subject ||
        current.isAnswered ||
        current.finished ||
        current.questions.length === 0
      ) {
        return;
      }

      const question = current.questions[current.currentIndex];
      if (!question) return;
      if (optionIndex < 0 || optionIndex >= question.options.length) return;

      const isCorrect = optionIndex === question.correctAnswer;
      const xpGain = isCorrect ? XP_PER_CORRECT : XP_PER_INCORRECT;
      const answerKey = `${current.sessionId}-q-${current.currentIndex}`;

      const { newlyUnlockedIds } = recordAnswer({
        subject: current.subject,
        isCorrect,
        answerKey,
      });

      const nextSession = {
        ...current,
        selectedIndex: optionIndex,
        isAnswered: true,
        score: current.score + (isCorrect ? 1 : 0),
        xpEarned: current.xpEarned + xpGain,
        answerStreak: isCorrect ? current.answerStreak + 1 : 0,
        answers: [
          ...current.answers,
          {
            questionId: question.id,
            selectedIndex: optionIndex,
            correctIndex: question.correctAnswer,
            isCorrect,
          },
        ],
        unlockedDuringSession: Array.from(
          new Set([...current.unlockedDuringSession, ...newlyUnlockedIds])
        ),
      };

      sessionRef.current = nextSession;
      setSession(nextSession);
    },
    [recordAnswer]
  );

  const advanceQuestion = useCallback(() => {
    const current = sessionRef.current;
    if (!current.isAnswered || current.finished) {
      return { finished: false, result: null };
    }

    const isLastQuestion =
      current.currentIndex >= current.questions.length - 1;

    if (isLastQuestion) {
      const finishedSession = {
        ...current,
        finished: true,
      };
      sessionRef.current = finishedSession;
      setSession(finishedSession);

      const result = completeQuiz({
        sessionId: current.sessionId,
        subject: current.subject,
        correct: current.score,
        total: current.questions.length,
        xpEarned: current.xpEarned,
        unlockedDuringSession: current.unlockedDuringSession,
      });

      return { finished: true, result };
    }

    const nextSession = {
      ...current,
      currentIndex: current.currentIndex + 1,
      selectedIndex: null,
      isAnswered: false,
    };
    sessionRef.current = nextSession;
    setSession(nextSession);

    return { finished: false, result: null };
  }, [completeQuiz]);

  const clearQuizSession = useCallback(() => {
    const empty = createInitialSession();
    sessionRef.current = empty;
    setSession(empty);
  }, []);

  const value = useMemo(
    () => ({
      session,
      startQuiz,
      selectAnswer,
      advanceQuestion,
      clearQuizSession,
    }),
    [session, startQuiz, selectAnswer, advanceQuestion, clearQuizSession]
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return ctx;
}
