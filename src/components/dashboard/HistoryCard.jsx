import React from 'react';
import {
  Calculator,
  FlaskConical,
  Globe,
  Landmark,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { getSubjectByParam } from '../../data/subjects.js';
import { formatReadableDate } from '../../utils/dates.js';

const ICON_MAP = {
  Calculator,
  FlaskConical,
  Globe,
  Landmark,
};

export default function HistoryCard({ entry }) {
  if (!entry) return null;

  const subjectMeta = getSubjectByParam(entry.subject);
  const IconComponent =
    (subjectMeta && ICON_MAP[subjectMeta.icon]) || CheckCircle2;
  const bgClass = subjectMeta?.bgClass || 'bg-lavender-bg';
  const accentClass = subjectMeta?.accentClass || 'text-lavender-dark';
  const formattedDate = formatReadableDate(entry.date);

  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-violet-200 transition-colors">
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className={`w-12 h-12 rounded-2xl ${bgClass} ${accentClass} flex items-center justify-center shrink-0 font-bold`}
          aria-hidden="true"
        >
          <IconComponent className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-extrabold text-ink truncate">
            {entry.subject} Challenge
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-body mt-0.5">
            Score:{' '}
            <span className="font-extrabold text-ink">
              {entry.correct}/{entry.total}
            </span>{' '}
            · Accuracy:{' '}
            <span className="font-extrabold text-ink">{entry.accuracy}%</span>
            {formattedDate ? ` · ${formattedDate}` : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-extrabold bg-mint-bg text-mint-dark border border-emerald-200">
          {entry.accuracy}% Accuracy
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-extrabold bg-sunny-bg text-amber-900 border border-yellow-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
          +{entry.xpEarned} XP
        </span>
      </div>
    </article>
  );
}
