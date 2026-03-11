import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        abril: ['"Abril Fatface"', "serif"],
      },
      colors: {
        // StyleBread Palette
        beige: {
          50: "#FAF7F2",   // Backgrounds suaves
          100: "#F5F2ED",
        },
        cream: {
          50: "#FFF8F0",   // Banners suaves
          100: "#FFF3E6",
        },
        mint: {
          50: "#E8F5F0",   // Seções alternadas
          100: "#D5EBE3",
        },
        brown: {
          50: "#F5EBE3",
          100: "#E8D5C4",
          600: "#8B5E3C",  // Textos quentes
          700: "#6B4A2C",
        },
        // Orange para CTAs (StyleBread usa laranja vibrante)
        orange: {
          50: "#FFF4ED",
          100: "#FFE5D4",
          400: "#FF8C5A",
          500: "#FF6B35",  // Principal
          600: "#E65A28",
          700: "#CC4D1F",
        },
        // Gray warm
        warmGray: {
          50: "#F5F5F0",
          100: "#E8E8E0",
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
        },
      },
    },
  },
  plugins: [],
};

export default config;