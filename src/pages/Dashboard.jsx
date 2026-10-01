import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Rocket } from 'lucide-react';
import { SUBJECTS } from '../data/subjects.js';
import { useProgress } from '../context/ProgressContext.jsx';
import { useQuiz } from '../context/QuizContext.jsx';
import { getSubjectQuestionCounts } from '../utils/quiz.js';
import HeroCard from '../components/dashboard/HeroCard.jsx';
import DailyProgress from '../components/dashboard/DailyProgress.jsx';
import SubjectCard from '../components/dashboard/SubjectCard.jsx';
import HistoryCard from '../components/dashboard/HistoryCard.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function Dashboard() {
  const { progress, levelInfo, effectiveStreak, todayStats } = useProgress();
  const { startQuiz } = useQuiz();
  const navigate = useNavigate();

  const questionCounts = useMemo(() => getSubjectQuestionCounts(), []);
  const recentHistory = (progress.quizHistory || []).slice(0, 3);

  const handleStartSubject = (subject) => {
    startQuiz(subject.slug);
    navigate(`/quiz/${subject.slug}`);
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lavender-bg text-lavender-dark text-xs font-extrabold mb-3">
            <span>✨ Interactive Learning Game</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
            LearnRush
          </h1>
          <p className="text-lg sm:text-xl font-bold text-lavender-dark mt-1">
            Learn something. Play something. Level up yourself.
          </p>
          <p className="text-sm sm:text-base font-medium text-body mt-1">
            Turn a few minutes of learning into points, streaks and achievements.
          </p>
        </div>

        <div className="shrink-0">
          <Button to="/challenge" size="lg" variant="primary" className="w-full md:w-auto">
            <Rocket className="w-5 h-5" aria-hidden="true" />
            <span>Start Challenge</span>
          </Button>
        </div>
      </div>

      {/* 2. Hero Card */}
      <HeroCard
        xp={progress.xp}
        levelInfo={levelInfo}
        streak={effectiveStreak}
      />

      {/* 3. Daily Progress Card */}
      <DailyProgress todayStats={todayStats} />

      {/* 4. Choose Your Adventure (4 SubjectCards) */}
      <section aria-labelledby="choose-adventure-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
          <div>
            <h2
              id="choose-adventure-heading"
              className="text-2xl font-extrabold text-ink"
            >
              Choose Your Adventure 🧭
            </h2>
            <p className="text-sm sm:text-base font-medium text-body mt-0.5">
              Pick a subject to jump straight into a 10-question challenge
            </p>
          </div>
          <Link
            to="/challenge"
            className="inline-flex items-center gap-1 text-sm font-extrabold text-lavender-dark hover:underline self-start sm:self-auto"
          >
            <span>View all challenges</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {SUBJECTS.map((subj) => (
            <SubjectCard
              key={subj.id}
              subject={subj}
              questionCount={questionCounts[subj.name] || 20}
              onStart={handleStartSubject}
            />
          ))}
        </div>
      </section>

      {/* 5. Recent Challenges */}
      <section aria-labelledby="recent-challenges-heading">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <h2
              id="recent-challenges-heading"
              className="text-2xl font-extrabold text-ink"
            >
              Recent Challenges 🕒
            </h2>
            <p className="text-sm sm:text-base font-medium text-body mt-0.5">
              Your latest completed quiz sessions
            </p>
          </div>
          {recentHistory.length > 0 && (
            <Link
              to="/progress"
              className="inline-flex items-center gap-1 text-sm font-extrabold text-lavender-dark hover:underline shrink-0"
            >
              <span>Full history</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          )}
        </div>

        {recentHistory.length === 0 ? (
          <EmptyState
            emoji="🎯"
            title="No challenges completed yet"
            message="Pick a subject above or click Start Challenge to play your first 10-question quiz!"
            actionLabel="Start Challenge"
            actionTo="/challenge"
          />
        ) : (
          <div className="space-y-3">
            {recentHistory.map((entry) => (
              <HistoryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
