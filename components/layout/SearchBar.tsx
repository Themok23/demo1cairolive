'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, User, FileText, Layers, MapPin, Sparkles } from 'lucide-react';
import type { SearchResult, SearchResultKind } from '@/src/application/use-cases/search/unifiedSearch';

const KIND_ICONS: Record<SearchResultKind, React.ElementType> = {
  person: User,
  article: FileText,
  pillar: Layers,
  place: MapPin,
  experience: Sparkles,
};

const KIND_LABEL: Record<SearchResultKind, { en: string; ar: string }> = {
  person:     { en: 'Person',     ar: 'شخصية' },
  article:    { en: 'Article',    ar: 'مقال' },
  pillar:     { en: 'Pillar',     ar: 'محور' },
  place:      { en: 'Place',      ar: 'مكان' },
  experience: { en: 'Experience', ar: 'تجربة' },
};

const KIND_HREF: Record<SearchResultKind, (locale: string, slug: string) => string> = {
  person:     (l, s) => `/${l}/krtk/${s}`,
  article:    (l, s) => `/${l}/articles/${s}`,
  pillar:     (l, s) => `/${l}/pillars/${s}`,
  place:      (l, s) => `/${l}/places/${s}`,
  experience: (l, s) => `/${l}/experiences/${s}`,
};

interface Props {
  locale: string;
}

export default function SearchBar({ locale }: Props) {
  const isAr = locale === 'ar';
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) { setResults([]); setLoading(false); return; }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=20`);
        const json = await res.json();
        setResults(json.data ?? []);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 200);
  }, []);

  useEffect(() => { search(query); }, [query, search]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !open)) {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') { setOpen(false); setQuery(''); setResults([]); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  function navigate(result: SearchResult) {
    router.push(KIND_HREF[result.kind](locale, result.slug) as any);
    setOpen(false); setQuery(''); setResults([]);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(c - 1, -1)); }
    else if (e.key === 'Enter' && cursor >= 0 && results[cursor]) navigate(results[cursor]);
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 bg-surface/60 text-sm text-text-tertiary hover:border-gold/40 hover:text-text-secondary transition-all duration-200"
        aria-label="Search"
      >
        <Search size={14} />
        <span className="hidden sm:inline">{isAr ? 'بحث...' : 'Search...'}</span>
        <kbd className="hidden sm:inline text-xs bg-surface-elevated px-1.5 py-0.5 rounded border border-border/40">⌘K</kbd>
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] px-4"
          onClick={() => { setOpen(false); setQuery(''); setResults([]); }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-xl bg-surface border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30">
              <Search size={18} className="text-text-tertiary shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setCursor(-1); }}
                onKeyDown={handleKey}
                placeholder={isAr ? 'ابحث عن شخصية، مكان، تجربة...' : 'Search people, places, experiences...'}
                className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none"
                dir={isAr ? 'rtl' : 'ltr'}
              />
              {query && (
                <button onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}>
                  <X size={16} className="text-text-tertiary hover:text-text-primary" />
                </button>
              )}
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {loading && (
                <div className="px-4 py-8 text-center text-sm text-text-tertiary">
                  {isAr ? 'جارٍ البحث...' : 'Searching...'}
                </div>
              )}
              {!loading && query.length >= 2 && results.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-text-tertiary">
                  {isAr ? 'لا نتائج' : 'No results found'}
                </div>
              )}
              {!loading && results.length > 0 && (
                <ul>
                  {results.map((r, i) => {
                    const Icon = KIND_ICONS[r.kind];
                    const label = KIND_LABEL[r.kind];
                    const title = isAr && r.titleAr ? r.titleAr : r.titleEn;
                    return (
                      <li key={`${r.kind}-${r.id}`}>
                        <button
                          onClick={() => navigate(r)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${i === cursor ? 'bg-gold/10' : 'hover:bg-surface-elevated'}`}
                        >
                          <span className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 text-gold">
                            <Icon size={15} />
                          </span>
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm font-medium text-text-primary truncate">{title}</p>
                            {r.snippet && <p className="text-xs text-text-tertiary truncate">{r.snippet}</p>}
                          </div>
                          <span className="shrink-0 text-xs text-text-tertiary/60">
                            {isAr ? label.ar : label.en}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
              {!query && (
                <div className="px-4 py-6 text-center text-xs text-text-tertiary">
                  {isAr ? 'اكتب للبحث عبر جميع المحتويات' : 'Type to search across all content'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
