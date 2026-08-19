import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#050816',
        surface: '#1a1a2e',
        primary: '#00F5D4',
        'primary-dark': '#00CC96',
        secondary: '#5B5FEE',
        accent: '#E94560',
        'text-primary': '#F8FAFC',
        'text-secondary': '#a0a0a0',
      },
      backgroundColor: {
        DEFAULT: '#050816',
      },
      textColor: {
        DEFAULT: '#F8FAFC',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
};

export default config;
