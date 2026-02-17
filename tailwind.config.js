/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Amiri', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
      },
      colors: {
        surface: {
          deep: '#0a0f1a',
          card: 'rgba(255, 255, 255, 0.03)',
          hover: 'rgba(255, 255, 255, 0.06)',
          active: 'rgba(255, 255, 255, 0.08)',
        },
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(16, 185, 129, 0.1)',
        'glow-md': '0 0 25px rgba(16, 185, 129, 0.2)',
        'glow-lg': '0 0 40px rgba(16, 185, 129, 0.15)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};