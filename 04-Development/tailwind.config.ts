import type { Config } from 'tailwindcss';

// rgb(var(--token) / <alpha-value>) lets Tailwind generate opacity variants:
//   bg-gold/10   →  rgb(var(--gold) / 0.1)
//   border-border/50  →  rgb(var(--border) / 0.5)
// This requires the CSS variable to hold an RGB triplet (no `rgb()` wrapper).
function token(name: string) {
  return `rgb(var(--${name}) / <alpha-value>)`;
}

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background:          token('background'),
        surface:             token('surface'),
        'surface-elevated':  token('surface-elevated'),
        border:              token('border'),
        'text-primary':      token('text-primary'),
        'text-secondary':    token('text-secondary'),
        gold:                token('gold'),
        amber:               token('amber'),
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

export default config;
