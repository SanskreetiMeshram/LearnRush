import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './Sidebar.jsx';

export default function MobileNavigation() {
  return (
    <nav
      aria-label="Mobile Main"
      className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg"
    >
      <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
        {NAV_ITEMS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl min-h-[48px] transition-all ${
                isActive
                  ? 'bg-lavender-bg text-lavender-dark font-extrabold shadow-2xs'
                  : 'text-body hover:text-ink font-semibold'
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span className="text-[11px] leading-tight mt-1 truncate max-w-full">
              {label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
