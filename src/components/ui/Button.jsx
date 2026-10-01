import React from 'react';
import { Link } from 'react-router-dom';

const VARIANT_CLASSES = {
  primary:
    'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-sm hover:brightness-105 hover:-translate-y-0.5 hover:shadow-md active:scale-95 border border-transparent',
  secondary:
    'bg-white text-ink border border-slate-200 shadow-sm hover:bg-lavender-light hover:border-violet-300 hover:-translate-y-0.5 active:scale-95',
  danger:
    'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 active:scale-95',
  'danger-solid':
    'bg-rose-600 text-white shadow-sm hover:bg-rose-700 active:scale-95 border border-transparent',
  ghost:
    'bg-transparent text-body hover:bg-slate-100 hover:text-ink active:scale-95 border border-transparent',
};

const SIZE_CLASSES = {
  sm: 'px-3.5 py-2 text-sm min-h-[40px] rounded-xl gap-1.5',
  md: 'px-5 py-2.5 text-base min-h-[44px] rounded-2xl gap-2',
  lg: 'px-6 py-3.5 text-base sm:text-lg min-h-[50px] rounded-2xl gap-2.5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  ...rest
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 select-none disabled:opacity-50 disabled:pointer-events-none';
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const combined = `${baseClasses} ${variantClass} ${sizeClass} ${className}`.trim();

  if (to && !disabled) {
    return (
      <Link to={to} onClick={onClick} className={combined} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={combined}
      {...rest}
    >
      {children}
    </button>
  );
}
