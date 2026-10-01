import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getSubjectByParam } from '../data/subjects.js';
import { useProgress } from '../context/ProgressContext.jsx';
import { useQuiz } from '../context/QuizContext.jsx';
import ResultsCard from '../components/results/ResultsCard.jsx';

export default function Results() {
  const { progress, levelInfo, effectiveStreak } = useProgress();
  const { startQuiz, clearQuizSession } = useQuiz();
  const navigate = useNavigate();

  const lastResult = progress.lastResult;

  if (!lastResult) {
    return <Navigate to="/" replace />;
  }

  const handlePlayAgain = () => {
    const subjectMeta = getSubjectByParam(lastResult.subject);
    const slug = subjectMeta ? subjectMeta.slug : 'science';
    startQuiz(slug);
    navigate(`/quiz/${slug}`);
  };

  const handleDashboard = () => {
    clearQuizSession();
    navigate('/');
  };

  const handleViewProgress = () => {
    clearQuizSession();
    navigate('/progress');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ResultsCard
        result={lastResult}
        levelInfo={levelInfo}
        streak={effectiveStreak}
        onPlayAgain={handlePlayAgain}
        onDashboard={handleDashboard}
        onViewProgress={handleViewProgress}
      />
    </div>
  );
}
