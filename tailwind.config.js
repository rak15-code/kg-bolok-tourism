/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand ocean / forest palette
        forest: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        ocean: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        deepsea: {
          400: '#3b82f6',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'eco-gradient':    'linear-gradient(135deg, #047857 0%, #0e7490 50%, #1e40af 100%)',
        'ocean-gradient':  'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
        'forest-gradient': 'linear-gradient(135deg, #065f46 0%, #047857 50%, #0e7490 100%)',
        'aurora':          'linear-gradient(135deg, #86efac 0%, #6ee7b7 30%, #67e8f9 60%, #22d3ee 100%)',
      },
      animation: {
        'fade-in':   'fadeIn 0.6s ease-out',
        'slide-up':  'slideUp 0.6s ease-out',
        'float':     'float 6s ease-in-out infinite',
        'shimmer':   'shimmer 3s linear infinite',
        'pulse-soft':'pulseSoft 4s ease-in-out infinite',
        'marquee':   'marquee 60s linear infinite',
      },
      keyframes: {
        fadeIn:   { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:  { '0%': { opacity: '0', transform: 'translateY(30px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float:    { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-14px)' } },
        shimmer:  { '0%': { backgroundPosition: '-200% center' }, '100%': { backgroundPosition: '200% center' } },
        pulseSoft:{ '0%,100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
        marquee:  { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
}
