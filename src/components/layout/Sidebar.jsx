import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Home,
  Gamepad2,
  BarChart3,
  Trophy,
  GraduationCap,
  Settings,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext.jsx';
import ConfirmDialog from '../ui/ConfirmDialog.jsx';

export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', emoji: '🏠', Icon: Home, end: true },
  { to: '/challenge', label: 'Challenge', emoji: '🎮', Icon: Gamepad2, end: false },
  { to: '/progress', label: 'Progress', emoji: '📊', Icon: BarChart3, end: false },
  { to: '/achievements', label: 'Achievements', emoji: '🏆', Icon: Trophy, end: false },
];

export default function Sidebar() {
  const { progress, levelInfo, resetAll } = useProgress();
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    if (!settingsOpen) return undefined;
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [settingsOpen]);

  const handleConfirmReset = () => {
    setConfirmResetOpen(false);
    setSettingsOpen(false);
    resetAll();
    navigate('/');
  };

  return (
    <>
      <aside
        aria-label="Sidebar"
        className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-30 bg-white border-r border-slate-200/80 shadow-xs select-none"
      >
        {/* Brand Logo */}
        <div className="px-6 py-5 border-b border-slate-100">
          <Link
            to="/"
            className="flex items-center gap-3 group rounded-2xl p-1 -m-1 focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-ink block leading-none">
                LearnRush
              </span>
              <span className="text-xs font-semibold text-lavender mt-0.5 block">
                Play &amp; Level Up
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav
          aria-label="Main"
          className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto"
        >
          {NAV_ITEMS.map(({ to, label, emoji, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all duration-150 ${
                  isActive
                    ? 'bg-lavender-bg text-lavender-dark shadow-xs'
                    : 'text-body hover:bg-slate-50 hover:text-ink'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span className="truncate">{label}</span>
              <span className="ml-auto text-sm" aria-hidden="true">
                {emoji}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Profile & Settings Block */}
        <div
          ref={popoverRef}
          className="p-4 border-t border-slate-100 relative bg-slate-50/50"
        >
          {settingsOpen && (
            <div
              role="menu"
              aria-label="Profile settings"
              className="absolute bottom-20 left-4 right-4 bg-white rounded-2xl p-3 border border-slate-200 shadow-xl z-40"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 pb-2 border-b border-slate-100">
                Settings
              </p>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setSettingsOpen(false);
                  setConfirmResetOpen(true);
                }}
                className="mt-1.5 w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
              >
                <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Reset Progress</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-sky-400 text-white flex items-center justify-center shrink-0 shadow-xs"
              aria-hidden="true"
            >
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-ink truncate">Learner</p>
              <p className="text-xs font-semibold text-body truncate">
                Lvl {levelInfo.level} {levelInfo.name} · {progress.xp} XP
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSettingsOpen((prev) => !prev)}
              aria-label="Settings and Reset Progress"
              aria-expanded={settingsOpen}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-body hover:text-ink hover:bg-slate-100 transition-colors shrink-0"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

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
    </>
  );
}
