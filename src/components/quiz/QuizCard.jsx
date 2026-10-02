import React from 'react';
import {
  ArrowLeft,
  Calculator,
  FlaskConical,
  Flame,
  Globe,
  Landmark,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { getSubjectByParam } from '../../data/subjects.js';
import ProgressBar from '../ui/ProgressBar.jsx';
import AnswerOption from './AnswerOption.jsx';
import FeedbackPanel from './FeedbackPanel.jsx';
import VoiceAssistant from './VoiceAssistant.jsx';

const ICON_MAP = {
  Calculator,
  FlaskConical,
  Globe,
  Landmark,
};

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

const DIFFICULTY_STYLES = {
  easy: {
    label: 'Easy',
    className: 'bg-mint-bg text-mint-dark border-emerald-200',
  },
  medium: {
    label: 'Medium',
    className: 'bg-sky-bg text-sky-dark border-blue-200',
  },
  challenging: {
    label: 'Challenging',
    className: 'bg-peach-bg text-peach-dark border-orange-200',
  },
};

export default function QuizCard({
  subjectName,
  question,
  currentIndex,
  totalQuestions,
  score,
  xpEarned,
  answerStreak,
  selectedIndex,
  isAnswered,
  onSelectOption,
  onNext,
  onExitRequest,
  nextButtonRef,
}) {
  if (!question) return null;

  const subjectMeta = getSubjectByParam(subjectName);
  const SubjectIcon =
    (subjectMeta && ICON_MAP[subjectMeta.icon]) || CheckCircle2;
  const difficultyMeta =
    DIFFICULTY_STYLES[question.difficulty] || DIFFICULTY_STYLES.easy;

  const questionNumber = currentIndex + 1;
  const isLastQuestion = questionNumber >= totalQuestions;
  const isCorrect = isAnswered && selectedIndex === question.correctAnswer;
  const correctOptionText = question.options[question.correctAnswer];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-100 shadow-soft">
      {/* Top Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onExitRequest}
            aria-label="Exit quiz challenge"
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl text-sm font-bold text-body hover:text-ink hover:bg-slate-100 border border-slate-200/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Exit</span>
          </button>

          {subjectMeta && (
            <span
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-extrabold border ${subjectMeta.badgeClass}`}
            >
              <SubjectIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{subjectMeta.name}</span>
            </span>
          )}
        </div>

        {/* Live Quiz Session Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-extrabold bg-mint-bg text-mint-dark border border-emerald-200"
            aria-label={`Current score: ${score} correct`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Score: {score}</span>
          </span>

          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-extrabold bg-sunny-bg text-amber-900 border border-yellow-300"
            aria-label={`XP earned in this quiz: ${xpEarned}`}
          >
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
            <span>+{xpEarned} XP</span>
          </span>

          <span
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-extrabold border ${
              answerStreak > 0
                ? 'bg-peach-bg text-orange-900 border-orange-300'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
            aria-label={`Current answer streak: ${answerStreak} in a row`}
          >
            <Flame
              className={`w-4 h-4 shrink-0 ${
                answerStreak > 0
                  ? 'text-orange-500 fill-orange-400'
                  : 'text-slate-400'
              }`}
              aria-hidden="true"
            />
            <span>{answerStreak} Streak</span>
          </span>
        </div>
      </div>

      {/* Question Progress Counter & Bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-sm sm:text-base font-extrabold text-ink">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${difficultyMeta.className}`}
          >
            {difficultyMeta.label}
          </span>
        </div>
        <ProgressBar
          value={questionNumber}
          max={totalQuestions}
          label={`Question ${questionNumber} of ${totalQuestions}`}
          height="h-3"
          color="bg-gradient-to-r from-blue-500 to-violet-500"
          animate={false}
        />
      </div>

      {/* Voice-to-Voice Assistant Powered by Whispr Flow */}
      <div className="mt-5">
        <VoiceAssistant
          question={question}
          currentIndex={currentIndex}
          totalQuestions={totalQuestions}
          isAnswered={isAnswered}
          isCorrect={isCorrect}
          correctOptionText={correctOptionText}
          explanation={question.explanation}
          onSelectOption={onSelectOption}
          onNext={onNext}
          referralUrl="https://wisprflow.ai/r?SANSKREETI1"
        />
      </div>

      {/* Question Prompt */}
      <div className="my-6 sm:my-7">
        <h2 className="text-xl sm:text-2xl font-extrabold text-ink leading-snug break-words">
          {question.question}
        </h2>
      </div>

      {/* Answer Options A, B, C, D */}
      <div
        role="group"
        aria-label="Answer options"
        className="space-y-3.5"
      >
        {question.options.map((optText, idx) => {
          let optionState = 'idle';
          if (isAnswered) {
            if (idx === question.correctAnswer) {
              optionState = 'correct';
            } else if (idx === selectedIndex) {
              optionState = 'incorrect';
            } else {
              optionState = 'dimmed';
            }
          }

          return (
            <AnswerOption
              key={`${question.id}-opt-${idx}`}
              letter={OPTION_LETTERS[idx] || String(idx + 1)}
              text={optText}
              state={optionState}
              disabled={isAnswered}
              onSelect={() => onSelectOption(idx)}
            />
          );
        })}
      </div>

      {/* Keyboard shortcut hint */}
      {!isAnswered && (
        <p className="mt-4 text-xs font-semibold text-slate-400 text-center hidden sm:block">
          Tip: Press keys <kbd className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold">A</kbd>–<kbd className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold">D</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold">1</kbd>–<kbd className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold">4</kbd> to answer quickly
        </p>
      )}

      {/* Feedback Panel */}
      {isAnswered && (
        <FeedbackPanel
          isCorrect={isCorrect}
          correctOptionText={correctOptionText}
          explanation={question.explanation}
          isLastQuestion={isLastQuestion}
          onNext={onNext}
          nextButtonRef={nextButtonRef}
        />
      )}
    </div>
  );
}
