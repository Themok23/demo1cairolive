'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage?.getItem('theme') as Theme | null;
  if (stored && ['light', 'dark', 'system'].includes(stored)) return stored;
  return 'dark';
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Read localStorage synchronously on first render to avoid a state mismatch
  // with the class the flash-prevention script already applied to <html>.
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() =>
    typeof window !== 'undefined' ? resolveTheme(getInitialTheme()) : 'dark'
  );

  const setTheme = (next: Theme) => {
    setThemeState(next);
    window.localStorage?.setItem('theme', next);
  };

  useEffect(() => {
    const root = document.documentElement;
    const resolved = resolveTheme(theme);
    setResolvedTheme(resolved);
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);

    // Keep in sync if user changes system preference while on 'system' mode
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => {
        const r = e.matches ? 'dark' : 'light';
        setResolvedTheme(r);
        root.classList.remove('light', 'dark');
        root.classList.add(r);
      };
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
