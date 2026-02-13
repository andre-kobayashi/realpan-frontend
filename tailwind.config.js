/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        ja: ['"Noto Sans JP"', 'system-ui', 'sans-serif'],
      },

      // =============================================
      // PALETA REAL PAN — Azul Marinho + Dourado
      // =============================================
      colors: {
        // Azul Marinho — cor principal da marca
        primary: {
          50:  '#f0f4f9',
          100: '#dce6f2',
          200: '#b9cde5',
          300: '#8aaed3',
          400: '#5a8dbe',
          500: '#3a70a8',
          600: '#2d5a8e',
          700: '#1e3a5f', // ← Navy principal
          800: '#162b47',
          900: '#0d1c2f',
        },
        // Dourado — cor de destaque / CTA
        accent: {
          50:  '#fffbf0',
          100: '#fff3cc',
          200: '#ffe680',
          300: '#ffd94d',
          400: '#f4c430', // ← Dourado principal
          500: '#e0a800',
          600: '#c48f00',
          700: '#a37500',
        },
        // Neutros
        neutral: {
          50:  '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Fundo bege suave (identidade japonesa)
        cream: {
          50:  '#fdfaf5',
          100: '#faf4e8',
          200: '#f5e8d0',
        },
      },

      borderRadius: {
        lg:   '0.75rem',
        xl:   '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },

      boxShadow: {
        soft: '0 4px 20px rgba(0,0,0,0.06)',
        card: '0 6px 30px rgba(0,0,0,0.08)',
        navy: '0 8px 32px rgba(30,58,95,0.18)',
      },

      animation: {
        'fade-in':  'fadeIn .4s ease-out',
        'slide-up': 'slideUp .4s ease-out',
      },

      spacing: {
        'section-sm': '3rem',
        'section-md': '5rem',
        'section-lg': '7rem',
      },
    },
  },
  plugins: [],
};

module.exports = config;
