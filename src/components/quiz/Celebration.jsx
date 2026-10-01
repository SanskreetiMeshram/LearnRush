import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const CONFETTI_PIECES = [
  { id: 1, x: -90, y: -75, rotate: -45, color: '#7C5CFC', shape: 'circle' },
  { id: 2, x: -55, y: -95, rotate: 30, color: '#10B981', shape: 'star' },
  { id: 3, x: -20, y: -85, rotate: -20, color: '#EAB308', shape: 'rect' },
  { id: 4, x: 20, y: -95, rotate: 45, color: '#3B82F6', shape: 'circle' },
  { id: 5, x: 60, y: -80, rotate: -35, color: '#EC4899', shape: 'star' },
  { id: 6, x: 95, y: -65, rotate: 60, color: '#F97316', shape: 'rect' },
  { id: 7, x: -75, y: -40, rotate: 25, color: '#3B82F6', shape: 'rect' },
  { id: 8, x: 75, y: -35, rotate: -50, color: '#10B981', shape: 'circle' },
  { id: 9, x: -35, y: -60, rotate: 15, color: '#EC4899', shape: 'circle' },
  { id: 10, x: 40, y: -55, rotate: -25, color: '#EAB308', shape: 'star' },
];

export default function Celebration({ active, triggerKey }) {
  const shouldReduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return undefined;
    }

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1150);

    return () => clearTimeout(timer);
  }, [active, triggerKey]);

  return (
    <AnimatePresence>
      {visible && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center overflow-hidden"
        >
          {shouldReduceMotion ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="px-5 py-2.5 rounded-full bg-sunny-bg text-amber-900 font-extrabold text-lg border-2 border-yellow-400 shadow-lg"
            >
              ⭐ +100 XP!
            </motion.div>
          ) : (
            <div className="relative flex items-center justify-center">
              {/* Confetti and Star Particles */}
              {CONFETTI_PIECES.map((piece) => (
                <motion.span
                  key={piece.id}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 0.4, rotate: 0 }}
                  animate={{
                    opacity: [1, 1, 0],
                    x: piece.x * 1.35,
                    y: [0, piece.y, piece.y + 35],
                    scale: [0.5, 1.15, 0.8],
                    rotate: piece.rotate * 2,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.05, ease: 'easeOut' }}
                  style={{
                    backgroundColor:
                      piece.shape !== 'star' ? piece.color : 'transparent',
                    color: piece.color,
                  }}
                  className={`absolute ${
                    piece.shape === 'circle'
                      ? 'w-3.5 h-3.5 rounded-full'
                      : piece.shape === 'rect'
                      ? 'w-4 h-2.5 rounded-xs'
                      : 'text-xl leading-none'
                  }`}
                >
                  {piece.shape === 'star' ? '★' : null}
                </motion.span>
              ))}

              {/* Floating +100 XP Pill */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.7 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: [16, -28, -54],
                  scale: [0.75, 1.12, 1],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                className="px-5 py-2 rounded-full bg-sunny-bg text-amber-900 font-extrabold text-xl border-2 border-yellow-400 shadow-xl flex items-center gap-1.5"
              >
                <span>🌟</span>
                <span>+100 XP</span>
              </motion.div>
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
