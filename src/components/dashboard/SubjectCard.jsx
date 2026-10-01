import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calculator,
  FlaskConical,
  Globe,
  Landmark,
  BookOpen,
} from 'lucide-react';

const ICON_MAP = {
  Calculator,
  FlaskConical,
  Globe,
  Landmark,
};

export default function SubjectCard({ subject, questionCount = 20, onStart }) {
  const navigate = useNavigate();
  if (!subject) return null;

  const IconComponent = ICON_MAP[subject.icon] || BookOpen;

  const handleClick = () => {
    if (typeof onStart === 'function') {
      onStart(subject);
    } else {
      navigate(`/quiz/${subject.slug}`);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18 }}
      className={`group w-full text-left rounded-3xl p-5 sm:p-6 ${subject.bgClass} border ${subject.borderClass} ${subject.hoverBorderClass} shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between min-h-[190px] focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2`}
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl ${subject.iconBgClass} shadow-xs flex items-center justify-center shrink-0`}
            aria-hidden="true"
          >
            <IconComponent className="w-6 h-6" />
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-white/80 text-ink border border-white/60 shadow-2xs">
            {questionCount} questions
          </span>
        </div>

        <h3 className="text-xl font-extrabold text-ink group-hover:translate-x-0.5 transition-transform">
          {subject.name}
        </h3>
        <p className="text-sm font-semibold text-body mt-1.5 leading-relaxed">
          {subject.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-black/5 flex items-center justify-between">
        <span className={`text-sm font-extrabold ${subject.accentClass}`}>
          Play 10-question quiz
        </span>
        <span
          className={`w-9 h-9 rounded-full ${subject.buttonBgClass} flex items-center justify-center shadow-xs transition-transform group-hover:translate-x-1`}
          aria-hidden="true"
        >
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </motion.button>
  );
}
