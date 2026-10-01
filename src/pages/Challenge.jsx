import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';
import { SUBJECTS } from '../data/subjects.js';
import { useQuiz } from '../context/QuizContext.jsx';
import { getSubjectQuestionCounts } from '../utils/quiz.js';
import SubjectCard from '../components/dashboard/SubjectCard.jsx';
import LoadingState from '../components/ui/LoadingState.jsx';

export default function Challenge() {
  const { startQuiz } = useQuiz();
  const navigate = useNavigate();
  const [isLaunching, setIsLaunching] = useState(false);

  const questionCounts = useMemo(() => getSubjectQuestionCounts(), []);

  const handleStartSubject = (subject) => {
    setIsLaunching(true);
    startQuiz(subject.slug);
    navigate(`/quiz/${subject.slug}`);
  };

  if (isLaunching) {
    return <LoadingState message="Preparing your challenge..." />;
  }

  return (
    <div className="space-y-7">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-lavender-bg text-lavender-dark mb-3">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Quiz Arena</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
          Pick your challenge 🎮
        </h1>
        <p className="text-base sm:text-lg font-bold text-lavender-dark mt-2">
          10 questions · +100 XP per correct answer · +10 XP for trying
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-body">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <HelpCircle className="w-4 h-4 text-sky" aria-hidden="true" />
            <span>10 shuffled questions per round</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mint-light border border-emerald-200/70 text-mint-dark">
            <CheckCircle2 className="w-4 h-4 text-mint" aria-hidden="true" />
            <span>Instant explanations &amp; XP rewards</span>
          </span>
        </div>
      </div>

      {/* Subject Cards Grid */}
      <section aria-label="Available subject challenges">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
    </div>
  );
}
