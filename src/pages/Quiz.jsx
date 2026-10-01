import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getSubjectByParam } from '../data/subjects.js';
import { useQuiz } from '../context/QuizContext.jsx';
import QuizCard from '../components/quiz/QuizCard.jsx';
import Celebration from '../components/quiz/Celebration.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import LoadingState from '../components/ui/LoadingState.jsx';

export default function Quiz() {
  const { subject: subjectParam } = useParams();
  const navigate = useNavigate();
  const { session, startQuiz, selectAnswer, advanceQuestion, clearQuizSession } =
    useQuiz();

  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const nextButtonRef = useRef(null);
  const isAdvancingRef = useRef(false);

  const subjectMeta = getSubjectByParam(subjectParam);

  // Start or synchronize session if navigating directly to /quiz/:subject or after page refresh
  useEffect(() => {
    if (!subjectMeta) return;
    if (
      session.subject !== subjectMeta.name ||
      session.finished ||
      session.questions.length === 0
    ) {
      startQuiz(subjectMeta.slug);
    }
  }, [
    subjectMeta,
    session.subject,
    session.finished,
    session.questions.length,
    startQuiz,
  ]);

  // Reset advancing lock when question changes
  useEffect(() => {
    isAdvancingRef.current = false;
  }, [session.currentIndex, session.sessionId]);

  // Move focus to Next Question button after answering for keyboard/screen-reader accessibility
  useEffect(() => {
    if (session.isAnswered && nextButtonRef.current) {
      const timer = setTimeout(() => {
        nextButtonRef.current?.focus();
      }, 40);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [session.isAnswered, session.currentIndex]);

  const handleSelectOption = useCallback(
    (index) => {
      if (session.isAnswered || session.finished) return;
      selectAnswer(index);
    },
    [session.isAnswered, session.finished, selectAnswer]
  );

  const handleNext = useCallback(() => {
    if (!session.isAnswered || session.finished || isAdvancingRef.current) {
      return;
    }
    isAdvancingRef.current = true;
    const { finished } = advanceQuestion();
    if (finished) {
      navigate('/results');
    }
  }, [session.isAnswered, session.finished, advanceQuestion, navigate]);

  // Keyboard support: 1-4 or A-D to choose an answer, Enter for Next
  useEffect(() => {
    if (!subjectMeta || exitDialogOpen) return undefined;

    const onKeyDown = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (!session.isAnswered) {
        const key = e.key.toUpperCase();
        const keyMap = {
          1: 0,
          2: 1,
          3: 2,
          4: 3,
          A: 0,
          B: 1,
          C: 2,
          D: 3,
        };
        if (Object.prototype.hasOwnProperty.call(keyMap, key)) {
          e.preventDefault();
          handleSelectOption(keyMap[key]);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    subjectMeta,
    exitDialogOpen,
    session.isAnswered,
    handleSelectOption,
    handleNext,
  ]);

  // Redirect invalid subjects to /challenge
  if (!subjectMeta) {
    return <Navigate to="/challenge" replace />;
  }

  // While session is initializing for this subject
  if (session.subject !== subjectMeta.name) {
    return <LoadingState message="Preparing your challenge..." />;
  }

  // If subject has 0 questions available
  if (session.questions.length === 0) {
    return (
      <div className="my-8">
        <h1 className="sr-only">{subjectMeta.name} Challenge</h1>
        <EmptyState
          emoji="📚"
          title="No questions available"
          message={`We couldn't find any questions for ${subjectMeta.name} right now.`}
          actionLabel="Back to Challenges"
          actionTo="/challenge"
        />
      </div>
    );
  }

  const currentQuestion = session.questions[session.currentIndex];
  const isCurrentCorrect =
    session.isAnswered &&
    currentQuestion &&
    session.selectedIndex === currentQuestion.correctAnswer;

  const handleExitRequest = () => {
    if (session.answers.length > 0) {
      setExitDialogOpen(true);
    } else {
      clearQuizSession();
      navigate('/challenge');
    }
  };

  const handleConfirmExit = () => {
    setExitDialogOpen(false);
    clearQuizSession();
    navigate('/challenge');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="sr-only">{subjectMeta.name} Quiz Challenge</h1>

      <Celebration
        active={Boolean(isCurrentCorrect)}
        triggerKey={`${session.sessionId}-${session.currentIndex}`}
      />

      <QuizCard
        subjectName={subjectMeta.name}
        question={currentQuestion}
        currentIndex={session.currentIndex}
        totalQuestions={session.questions.length}
        score={session.score}
        xpEarned={session.xpEarned}
        answerStreak={session.answerStreak}
        selectedIndex={session.selectedIndex}
        isAnswered={session.isAnswered}
        onSelectOption={handleSelectOption}
        onNext={handleNext}
        onExitRequest={handleExitRequest}
        nextButtonRef={nextButtonRef}
      />

      <ConfirmDialog
        open={exitDialogOpen}
        title="Leave this challenge?"
        message="Leave this challenge? Your progress in this quiz will be lost."
        confirmLabel="Leave Challenge"
        cancelLabel="Keep Playing"
        onConfirm={handleConfirmExit}
        onCancel={() => setExitDialogOpen(false)}
        tone="danger"
      />
    </div>
  );
}
