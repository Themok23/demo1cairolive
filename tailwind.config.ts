import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0B',
        surface: '#141416',
        'surface-elevated': '#1C1C1F',
        border: '#2A2A2E',
        'text-primary': '#FAFAFA',
        'text-secondary': '#A1A1AA',
        gold: '#D4A853',
        amber: '#F59E0B',
      },
      backgroundColor: {
        DEFAULT: '#0A0A0B',
      },
      textColor: {
        DEFAULT: '#FAFAFA',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

export default config;
