'use client';

import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Monitor } from 'lucide-react';

const options = [
  { value: 'light',  Icon: Sun,     label: 'Light'  },
  { value: 'dark',   Icon: Moon,    label: 'Dark'   },
  { value: 'system', Icon: Monitor, label: 'System' },
] as const;

const btnClass =
  'flex items-center justify-center w-9 h-9 rounded-lg border border-border/50 bg-surface text-text-secondary transition-all duration-200';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // mounted guard: SSR and the first client render must output identical HTML.
  // Without this the icon (Sun vs Moon) and aria-label differ between server
  // and client, causing the hydration mismatch.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render an empty placeholder with identical size/shape during SSR and
  // first paint. After mount we swap in the correct icon with no layout shift.
  if (!mounted) {
    return <button className={btnClass} aria-label="Toggle theme" disabled />;
  }

  const isDark = resolvedTheme === 'dark';
  const Icon   = isDark ? Sun : Moon;

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`${btnClass} hover:border-gold/50 hover:text-gold`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Icon size={16} />
    </button>
  );
}

/**
 * ThemeSelector — three-way picker (Light / Dark / System).
 * Use this in a settings dropdown if you want full control.
 */
export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-surface p-1">
      {options.map(({ value, Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-150 ${
            theme === value
              ? 'bg-gold/10 text-gold border border-gold/20'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
          }`}
          aria-label={`${label} mode`}
          title={`${label} mode`}
        >
          <Icon size={13} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
