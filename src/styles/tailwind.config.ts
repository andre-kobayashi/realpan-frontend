/* ══════════════════════════════════════════════════════════════════
   tailwind.config.ts — Real Pan Redesign (Style Bread aesthetic)
   ══════════════════════════════════════════════════════════════════ */

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /* ── Brand Colors ── */
      colors: {
        // Warm cream/beige background palette
        cream: {
          50:  '#FEFCF8',
          100: '#FBF7EF',
          200: '#F5EDE0',
          300: '#EDE0CC',
          400: '#DFD0B3',
          500: '#C9B896',
          600: '#B09A72',
        },
        // Golden/brown — primary action & accent
        bread: {
          50:  '#FDF8ED',
          100: '#FAEFD3',
          200: '#F4DCA5',
          300: '#ECC76E',
          400: '#E4B142',
          500: '#D4972A',  // main brand gold
          600: '#B87A20',
          700: '#965C1C',
          800: '#7B4A1E',
          900: '#66401D',
        },
        // Deep navy — text & header
        navy: {
          50:  '#F0F3F7',
          100: '#D9E0EA',
          200: '#B3C1D5',
          300: '#8099B8',
          400: '#57749A',
          500: '#3A567D',
          600: '#2D4466',
          700: '#233550',
          800: '#1A2740',  // main text
          900: '#111B2E',
        },
        // Accent red (for bestseller badge, alerts)
        accent: {
          400: '#E4B142', // gold accent (same as bread-400)
          500: '#D4972A', // gold
          600: '#B87A20',
        },
        // Keep old primary/neutral as aliases for backward compat
        primary: {
          50:  '#F0F3F7',
          100: '#D9E0EA',
          200: '#B3C1D5',
          300: '#8099B8',
          400: '#57749A',
          500: '#3A567D',
          600: '#2D4466',
          700: '#233550',
          800: '#1A2740',
          900: '#111B2E',
        },
      },

      /* ── Typography ── */
      fontFamily: {
        sans: [
          '"Noto Sans JP"',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        display: [
          '"Cormorant Garamond"',
          '"Noto Serif JP"',
          'Georgia',
          'serif',
        ],
      },

      /* ── Shadows ── */
      boxShadow: {
        'bread': '0 4px 20px rgba(180, 140, 60, 0.08)',
        'card': '0 2px 12px rgba(26, 39, 64, 0.06)',
        'card-hover': '0 8px 30px rgba(26, 39, 64, 0.10)',
        'float': '0 12px 40px rgba(26, 39, 64, 0.12)',
      },

      /* ── Border Radius ── */
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },

      /* ── Container ── */
      maxWidth: {
        'site': '1280px',
      },

      /* ── Animations ── */
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-in-bottom': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-in-bottom': 'slide-in-bottom 0.3s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
