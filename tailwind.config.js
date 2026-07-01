/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          50:  '#e8f4f6',
          100: '#c5e3e9',
          200: '#9ecfda',
          300: '#6eb8cb',
          400: '#3fa4bb',
          500: '#2a8ea3',
          600: '#1a6b7a',
          700: '#0e4a56',
          800: '#073340',
          900: '#031e27',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'sans-serif'],
      },
      transitionTimingFunction: {
        'ios': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'ios-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'ease-ios': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'ease-ios-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-ios forwards',
        'slide-up': 'slideUp 0.4s ease-ios-spring forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
