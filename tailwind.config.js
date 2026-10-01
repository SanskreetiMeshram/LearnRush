/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Nunito"', '"Poppins"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Poppins"', '"Nunito"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        'bg-app': '#F5F9FF',
        sky: {
          bg: '#DCEBFF',
          light: '#EBF3FF',
          DEFAULT: '#3B82F6',
          accent: '#3B82F6',
          dark: '#1D4ED8',
        },
        lavender: {
          bg: '#EAE4FF',
          light: '#F3F0FF',
          DEFAULT: '#7C5CFC',
          accent: '#7C5CFC',
          dark: '#5B21B6',
        },
        pink: {
          bg: '#FFE4F1',
          light: '#FFF0F7',
          DEFAULT: '#EC4899',
          accent: '#EC4899',
          dark: '#BE185D',
        },
        mint: {
          bg: '#D9F7EA',
          light: '#EAFBF3',
          DEFAULT: '#10B981',
          accent: '#10B981',
          dark: '#047857',
        },
        peach: {
          bg: '#FFE8D6',
          light: '#FFF3EA',
          DEFAULT: '#F97316',
          accent: '#F97316',
          dark: '#C2410C',
        },
        sunny: {
          bg: '#FFF5C2',
          light: '#FFFBEB',
          DEFAULT: '#EAB308',
          accent: '#EAB308',
          dark: '#A16207',
        },
        ink: '#1E2350',
        body: '#4B5580',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(30, 35, 80, 0.06)',
        card: '0 2px 12px -1px rgba(30, 35, 80, 0.05)',
        'card-hover': '0 12px 28px -4px rgba(124, 92, 252, 0.14)',
      },
    },
  },
  plugins: [],
};
