import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: 'var(--gold, #d4a017)',
        beige: 'var(--beige, #fff6e5)',
        dark: 'var(--dark, #1f2937)',
      },
    },
    screens: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
  },
  plugins: [],
};

export default config;
