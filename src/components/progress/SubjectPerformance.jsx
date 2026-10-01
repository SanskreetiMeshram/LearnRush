import React from 'react';
import {
  Calculator,
  FlaskConical,
  Globe,
  Landmark,
  BookOpen,
} from 'lucide-react';
import { SUBJECTS } from '../../data/subjects.js';
import { calculateAccuracy } from '../../utils/quiz.js';
import ProgressBar from '../ui/ProgressBar.jsx';

const ICON_MAP = {
  Calculator,
  FlaskConical,
  Globe,
  Landmark,
};

export default function SubjectPerformance({ stats = {} }) {
  return (
    <section
      aria-label="Subject Performance"
      className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-card"
    >
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-ink">
          Subject Performance 🎯
        </h2>
        <p className="text-sm font-medium text-body mt-0.5">
          Accuracy breakdown across each learning topic
        </p>
      </div>

      <div className="space-y-5">
        {SUBJECTS.map((subj) => {
          const entry = stats?.[subj.name] || { answered: 0, correct: 0 };
          const answered = entry.answered || 0;
          const correct = entry.correct || 0;
          const accuracy = calculateAccuracy(correct, answered);
          const IconComponent = ICON_MAP[subj.icon] || BookOpen;

          return (
            <div
              key={subj.name}
              className={`rounded-2xl p-4 border ${subj.borderClass} ${subj.lightBgClass}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl ${subj.iconBgClass} shadow-2xs flex items-center justify-center shrink-0`}
                    aria-hidden="true"
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-ink leading-tight">
                      {subj.name}
                    </h3>
                    <p className="text-xs font-semibold text-body">
                      {answered > 0
                        ? `${correct} correct of ${answered} answered`
                        : 'No answers yet'}
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-extrabold bg-white border ${subj.borderClass} ${subj.accentClass}`}
                >
                  {answered > 0 ? `${accuracy}%` : 'No answers yet'}
                </span>
              </div>

              <ProgressBar
                value={answered > 0 ? accuracy : 0}
                max={100}
                label={`${subj.name} accuracy`}
                height="h-3"
                trackColor="bg-white/90"
                color={subj.barColor}
                animate
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
