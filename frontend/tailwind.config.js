/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#6C5CE7', // Friendly Purple
          50: '#F0F3FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6C5CE7', // Main Brand
          600: '#5A4AD1',
          700: '#4837B5',
          800: '#3A2C90',
          900: '#2E2472',
        },
        accent: {
          green: '#00B894', // Growth Green
          'green-light': '#55EFC4',
          'green-dark': '#00A383',
          yellow: '#FDCB6E', // Optimistic Yellow
          red: '#FF7675',   // Soft Error
        },
        surface: {
          DEFAULT: '#F9FAFB', // Light Grey Background
          paper: '#FFFFFF',   // White Card Background
          muted: '#F3F4F6',   // Secondary Background
        },
        txt: {
          primary: '#2D3436', // Dark Grey (Soft Black)
          secondary: '#636E72', // Medium Grey
          muted: '#B2BEC3', // Light Grey
          inverted: '#FFFFFF',
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem', // Bubbly
        'full': '9999px',
      },
      boxShadow: {
        'card': '0 4px 0 0 #E5E7EB', // Solid shadow for "button-like" feel
        'card-hover': '0 8px 0 0 #E5E7EB, 0 4px 12px rgba(0,0,0,0.05)',
        'btn': '0 4px 0 0 rgba(0,0,0,0.1)', // Subtle depth
        'btn-active': '0 2px 0 0 rgba(0,0,0,0.1)',
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 2s infinite',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(-3%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
