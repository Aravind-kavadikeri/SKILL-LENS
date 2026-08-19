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
        background: '#030508',
        surface: '#0A0D14',
        'surface-hover': '#111624',
        'surface-border': '#1E2333',
        primary: '#00F5D4',
        'primary-dark': '#00CC96',
        secondary: '#6366F1',
        accent: '#EC4899',
        'text-primary': '#FFFFFF',
        'text-secondary': '#94A3B8',
        'text-muted': '#64748B',
      },
      backgroundColor: {
        DEFAULT: '#030508',
      },
      textColor: {
        DEFAULT: '#FFFFFF',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.65)',
        glow: '0 0 25px rgba(0, 245, 212, 0.15)',
        'glow-lg': '0 0 40px rgba(0, 245, 212, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;

