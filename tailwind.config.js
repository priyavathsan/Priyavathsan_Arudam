/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vedic: {
          50: '#fbf8f1',
          100: '#f5edd9',
          200: '#edd9b0',
          300: '#e1be81',
          400: '#d7a456',
          500: '#cc8833',
          600: '#b76d28',
          700: '#955022',
          800: '#7a4020',
          900: '#64351c',
        },
        cosmic: {
          950: '#07090e',
          900: '#0b0f19',
          850: '#111726',
          800: '#182033',
          700: '#232d47',
          600: '#344163',
          500: '#4c5c87',
        },
        gold: {
          light: '#fde68a',
          DEFAULT: '#f59e0b',
          dark: '#b45309',
          glow: '#fbbf24',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        tamil: ['Latha', '"Mukta Malar"', '"Noto Sans Tamil"', 'sans-serif'],
      },
      letterSpacing: {
        tamil: '0.05em',
      },
      boxShadow: {
        'glow-gold': '0 0 20px -3px rgba(245, 158, 11, 0.25)',
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.3)',
      },
    },
  },
  plugins: [],
}
