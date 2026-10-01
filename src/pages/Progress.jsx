import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  Flame,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Target,
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext.jsx';
import { calculateAccuracy } from '../utils/quiz.js';
import StatCard from '../components/ui/StatCard.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import HistoryCard from '../components/dashboard/HistoryCard.jsx';
import WeeklyChart from '../components/progress/WeeklyChart.jsx';
import SubjectPerformance from '../components/progress/SubjectPerformance.jsx';

export default function Progress() {
  const { progress, levelInfo, effectiveStreak, resetAll } = useProgress();
  const navigate = useNavigate();
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const totalQuestions = progress.totalQuestions || 0;
  const correctAnswers = progress.correctAnswers || 0;
  const overallAccuracy =
    totalQuestions > 0
      ? `${calculateAccuracy(correctAnswers, totalQuestions)}%`
      : '—';

  const historyList = (progress.quizHistory || []).slice(0, 10);

  const handleConfirmReset = () => {
    setConfirmResetOpen(false);
    resetAll();
    navigate('/');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-sky-bg text-sky-dark mb-2.5">
            <span>📊 Analytics &amp; History</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
            Your Learning Progress
          </h1>
          <p className="text-sm sm:text-base font-medium text-body mt-1">
            Track your XP, accuracy, weekly consistency, and subject mastery.
          </p>
        </div>

        <div className="shrink-0">
          <Button
            variant="danger"
            size="md"
            onClick={() => setConfirmResetOpen(true)}
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Reset Progress</span>
          </Button>
        </div>
      </div>

      {/* 5 StatCards Grid */}
      <section aria-label="Key learning statistics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            icon={Sparkles}
            label="Total XP"
            value={progress.xp.toLocaleString()}
            hint={`Level ${levelInfo.level} ${levelInfo.name}`}
            tone="sunny"
          />
          <StatCard
            icon={HelpCircle}
            label="Questions Answered"
            value={totalQuestions}
            hint={`${progress.completedQuizzes || 0} quizzes completed`}
            tone="sky"
          />
          <StatCard
            icon={CheckCircle2}
            label="Correct Answers"
            value={correctAnswers}
            hint={`Best streak: ${progress.bestAnswerStreak || 0} in a row`}
            tone="mint"
          />
          <StatCard
            icon={Target}
            label="Accuracy"
            value={overallAccuracy}
            hint={totalQuestions > 0 ? 'Overall precision' : 'Answer a question first'}
            tone="lavender"
          />
          <StatCard
            icon={Flame}
            label="Current Streak"
            value={`${effectiveStreak} ${effectiveStreak === 1 ? 'day' : 'days'}`}
            hint={effectiveStreak > 0 ? 'Keep it going!' : 'Complete a quiz today'}
            tone="peach"
          />
        </div>
      </section>

      {/* Level Progress Card */}
      <section
        aria-label="Level progress details"
        className="bg-gradient-to-r from-lavender-bg via-white to-sky-bg rounded-3xl p-6 sm:p-7 border border-violet-200/80 shadow-card"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl bg-white text-lavender flex items-center justify-center shadow-xs shrink-0"
              aria-hidden="true"
            >
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-ink">
                Level {levelInfo.level}: {levelInfo.name}
              </h2>
              <p className="text-sm font-semibold text-body">
                {levelInfo.isMaxLevel
                  ? 'Max level reached 🎉'
                  : `You're only ${levelInfo.xpToNext} XP away from Level ${
                      levelInfo.level + 1
                    } (${levelInfo.nextLevelName}).`}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center self-start sm:self-auto px-3.5 py-1.5 rounded-full text-sm font-extrabold bg-white text-ink border border-violet-200 shadow-2xs">
            {levelInfo.isMaxLevel
              ? `${progress.xp} XP · Max Level`
              : `${progress.xp} / ${levelInfo.nextLevelXp} XP`}
          </span>
        </div>

        <ProgressBar
          value={levelInfo.progressPercent}
          max={100}
          label="Progress toward next level"
          height="h-3.5"
          trackColor="bg-white/90 border border-violet-200/70"
          color="bg-gradient-to-r from-blue-500 to-violet-500"
          animate
        />
      </section>

      {/* Weekly Activity & Subject Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyChart dailyStats={progress.dailyStats} />
        <SubjectPerformance stats={progress.subjectStats} />
      </div>

      {/* Quiz History (up to 10 entries) */}
      <section aria-labelledby="quiz-history-heading">
        <div className="mb-4">
          <h2
            id="quiz-history-heading"
            className="text-2xl font-extrabold text-ink"
          >
            Recent Challenges 📜
          </h2>
          <p className="text-sm sm:text-base font-medium text-body mt-0.5">
            Your last {historyList.length > 0 ? historyList.length : ''} completed quiz results
          </p>
        </div>

        {historyList.length === 0 ? (
          <EmptyState
            emoji="🚀"
            title="Your learning journey starts here 🚀"
            message="Complete your first challenge to see your history."
            actionLabel="Start Challenge"
            actionTo="/challenge"
          />
        ) : (
          <div className="space-y-3">
            {historyList.map((entry) => (
              <HistoryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </section>

      {/* Bottom Reset Progress Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-ink">
            Want a fresh start?
          </h2>
          <p className="text-sm text-body">
            Resetting clears your XP, streak, achievements, and quiz history from this browser.
          </p>
        </div>
        <Button
          variant="danger"
          onClick={() => setConfirmResetOpen(true)}
          className="shrink-0"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>Reset Progress</span>
        </Button>
      </div>

      <ConfirmDialog
        open={confirmResetOpen}
        title="Reset Learning Progress?"
        message="Are you sure you want to reset all learning progress?"
        confirmLabel="Reset"
        cancelLabel="Cancel"
        onConfirm={handleConfirmReset}
        onCancel={() => setConfirmResetOpen(false)}
        tone="danger"
      />
    </div>
  );
}
