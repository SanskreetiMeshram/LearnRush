import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sparkles, Settings, RotateCcw } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext.jsx';
import XPBadge, { LevelBadge } from '../ui/XPBadge.jsx';
import StreakBadge from '../ui/StreakBadge.jsx';
import ConfirmDialog from '../ui/ConfirmDialog.jsx';
import { NAV_ITEMS } from './Sidebar.jsx';

export default function Navbar() {
  const { progress, levelInfo, effectiveStreak, resetAll } = useProgress();
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!settingsOpen) return undefined;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
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
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Mobile & Tablet Brand Logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <Link
              to="/"
              className="flex items-center gap-2.5 rounded-xl p-1 -m-1"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white shadow-xs shrink-0">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="text-lg font-extrabold text-ink tracking-tight">
                LearnRush
              </span>
            </Link>
          </div>

          {/* Tablet Compact Navigation (768px - 1023px) */}
          <nav
            aria-label="Tablet Main"
            className="hidden md:flex lg:hidden items-center gap-1"
          >
            {NAV_ITEMS.map(({ to, label, Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-lavender-bg text-lavender-dark'
                      : 'text-body hover:bg-slate-100 hover:text-ink'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Desktop left greeting / status */}
          <div className="hidden lg:flex items-center gap-2 text-sm font-bold text-body">
            <span className="inline-block w-2 h-2 rounded-full bg-mint" aria-hidden="true" />
            <span>Keep your curiosity growing every day!</span>
          </div>

          {/* Live Badges & Mobile/Tablet Settings */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <div className="hidden sm:block">
              <LevelBadge
                level={levelInfo.level}
                name={levelInfo.name}
                size="sm"
              />
            </div>
            <XPBadge xp={progress.xp} size="sm" />
            <StreakBadge days={effectiveStreak} size="sm" compact />

            {/* Mobile/Tablet Settings trigger */}
            <div ref={menuRef} className="relative lg:hidden">
              <button
                type="button"
                onClick={() => setSettingsOpen((prev) => !prev)}
                aria-label="Settings and Reset Progress"
                aria-expanded={settingsOpen}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-body hover:text-ink hover:bg-slate-100 border border-slate-200/80 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>

              {settingsOpen && (
                <div
                  role="menu"
                  aria-label="Mobile settings"
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl p-3 border border-slate-200 shadow-xl z-50"
                >
                  <div className="px-2 pb-2 mb-1.5 border-b border-slate-100">
                    <p className="text-xs font-extrabold text-ink">
                      Learner · Lvl {levelInfo.level} {levelInfo.name}
                    </p>
                    <p className="text-xs text-body">{progress.xp} XP earned</p>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setSettingsOpen(false);
                      setConfirmResetOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Reset Progress</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

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
