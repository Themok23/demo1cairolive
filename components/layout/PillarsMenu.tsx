'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Compass } from 'lucide-react';
import * as Icons from 'lucide-react';

interface PillarMenuItem {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  iconKey: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
}

interface PillarsMenuProps {
  pillars: PillarMenuItem[];
  locale: string;
  label: string;
  featured?: boolean;
}

export default function PillarsMenu({ pillars, locale, label, featured = false }: PillarsMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAr = locale === 'ar';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  if (pillars.length === 0) return null;

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        aria-haspopup="true"
        aria-expanded={open}
        className={
          featured
            ? `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-gold/10 border border-gold/25 text-gold hover:bg-gold/20 hover:border-gold/40 transition-all duration-200`
            : `flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-gold transition-colors duration-200`
        }
      >
        {featured && <Compass size={14} className="opacity-80" />}
        {label}
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''} ${featured ? 'opacity-70' : ''}`}
        />
      </button>

      {open && (
        <div
          className={`absolute top-full mt-3 ${isAr ? 'right-0' : 'left-0'} z-50 min-w-[480px] max-w-[640px] rounded-xl border border-gold/20 bg-surface/95 backdrop-blur-xl shadow-2xl shadow-black/30 p-2 animate-in fade-in slide-in-from-top-2 duration-200`}
          onMouseLeave={() => setOpen(false)}
        >
          <div className="grid grid-cols-2 gap-1">
            {pillars.map((p) => {
              const Icon = p.iconKey
                ? ((Icons as any)[p.iconKey] as
                    | React.ComponentType<{ size?: number; className?: string }>
                    | undefined)
                : undefined;
              const name = isAr && p.nameAr ? p.nameAr : p.nameEn;
              const desc = isAr && p.descriptionAr ? p.descriptionAr : p.descriptionEn;
              return (
                <Link
                  key={p.id}
                  href={`/${locale}/pillars/${p.slug}` as any}
                  onClick={() => setOpen(false)}
                  className="group flex items-start gap-3 p-3 rounded-lg hover:bg-gold/8 transition-colors"
                >
                  <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-gold/10 ring-1 ring-gold/20 group-hover:bg-gold/20 transition-colors">
                    {Icon ? (
                      <Icon size={18} className="text-gold" />
                    ) : (
                      <span className="text-sm font-bold text-gold">{name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-sm font-semibold text-text-primary group-hover:text-gold transition-colors truncate"
                      lang={locale}
                    >
                      {name}
                    </p>
                    {desc && (
                      <p
                        className="text-xs text-text-secondary line-clamp-2 mt-0.5"
                        lang={locale}
                      >
                        {desc}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-2 pt-2 border-t border-gold/10">
            <Link
              href={`/${locale}/pillars` as any}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-xs font-semibold text-gold hover:bg-gold/8 rounded-lg transition-colors text-center"
            >
              {isAr ? 'كل المحاور' : 'View all pillars'}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
