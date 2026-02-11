import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem'
      }
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        ja: ['"Noto Sans JP"', 'system-ui', 'sans-serif']
      },

      colors: {
        primary: {
          50: '#fef6f4',
          100: '#fde7e2',
          200: '#fbcfc5',
          300: '#f7a99a',
          400: '#f27a63',
          500: '#e5533d',
          600: '#cf3f2a',
          700: '#ac3424'
        },
        accent: {
          500: '#e11d48',
          600: '#be123c',
          700: '#9f1239'
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          600: '#525252',
          700: '#404040',
          900: '#171717'
        }
      },

      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem'
      },

      boxShadow: {
        soft: '0 4px 20px rgba(0,0,0,0.06)',
        card: '0 6px 30px rgba(0,0,0,0.08)'
      },

      animation: {
        'fade-in': 'fadeIn .4s ease-out',
        'slide-up': 'slideUp .4s ease-out'
      },
      
      // ADICIONADO AQUI
      spacing: {
        'section-sm': '3rem',   // 48px
        'section-md': '5rem',   // 80px
        'section-lg': '7rem'    // 112px
      }
    }
  },
  plugins: []
};

export default config;