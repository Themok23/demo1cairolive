'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Menu, X, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTranslations } from 'next-intl';
import PillarsMenu from '@/components/layout/PillarsMenu';
import SearchBar from '@/components/layout/SearchBar';

interface PillarMenuItem {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  iconKey: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
}

const NAV_LINKS = (locale: string, isAr: boolean, t: (key: string) => string) => [
  { href: `/${locale}/places`,      label: isAr ? 'أماكن'    : 'Places'      },
  { href: `/${locale}/people`,      label: t('people')                        },
  { href: `/${locale}/articles`,    label: t('articles')                      },
  { href: `/${locale}/experiences`, label: isAr ? 'تجارب'    : 'Experiences'  },
  { href: `/${locale}/krtk`,        label: t('krtk')                          },
];

export default function Header() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [pillars, setPillars] = useState<PillarMenuItem[]>([]);
  const t = useTranslations('nav');
  const isAr = locale === 'ar';

  useEffect(() => {
    fetch('/api/pillars')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => Array.isArray(data) && setPillars(data))
      .catch(() => setPillars([]));
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = NAV_LINKS(locale, isAr, t);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-border/50 bg-surface/80 backdrop-blur-xl shadow-lg'
          : 'border-b border-border/30 bg-surface/40 backdrop-blur-md'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gold to-amber shadow-lg group-hover:shadow-xl transition-shadow duration-300" />
            <span className="text-lg font-bold bg-gradient-to-r from-gold via-amber to-gold bg-clip-text text-transparent">
              CAIRO LIVE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">

            {/* Explore — featured pill */}
            <PillarsMenu
              pillars={pillars}
              locale={locale}
              label={isAr ? 'استكشف' : 'Explore'}
              featured
            />

            {/* Divider */}
            <div className="w-px h-4 bg-border/50 mx-3 flex-shrink-0" />

            {/* Flat nav links */}
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href as any}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  pathname.startsWith(href)
                    ? 'text-gold bg-gold/8'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
            <SearchBar locale={locale} />
            <ThemeToggle />
            <LanguageSwitcher />
            <div className="w-px h-4 bg-border/50 mx-1" />
            <Button variant="outline" size="sm">
              <Link href={`/${locale}/subscribe`}>{t('subscribe')}</Link>
            </Button>
            <Button variant="primary" size="sm">
              <Link href={`/${locale}/submit`}>{t('submit')}</Link>
            </Button>
          </div>

          {/* Mobile: controls + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 text-text-primary hover:text-gold transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="animate-in fade-in slide-in-from-top-2 border-t border-border/30 bg-surface/95 backdrop-blur-lg pb-4 md:hidden">
            <div className="flex flex-col gap-1 py-4">

              {/* Explore section */}
              {pillars.length > 0 && (
                <div className="px-4 py-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={13} className="text-gold" />
                    <p className="text-xs font-bold text-gold uppercase tracking-widest">
                      {isAr ? 'استكشف' : 'Explore'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    {pillars.map((p) => {
                      const name = isAr && p.nameAr ? p.nameAr : p.nameEn;
                      return (
                        <Link
                          key={p.id}
                          href={`/${locale}/pillars/${p.slug}` as any}
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-3 py-2 text-sm font-medium text-text-primary hover:text-gold hover:bg-gold/5 rounded-lg transition-colors"
                          lang={locale}
                        >
                          {name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="border-t border-border/20 my-1 mx-4" />

              {/* Flat links */}
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href as any}
                  onClick={() => setIsMenuOpen(false)}
                  className="mx-2 px-3 py-2 text-sm font-medium text-text-secondary hover:text-gold hover:bg-surface-elevated rounded-lg transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}

              <div className="flex gap-2 px-4 pt-3">
                <Button variant="outline" size="sm" className="flex-1">
                  <Link href={`/${locale}/subscribe`} onClick={() => setIsMenuOpen(false)}>{t('subscribe')}</Link>
                </Button>
                <Button variant="primary" size="sm" className="flex-1">
                  <Link href={`/${locale}/submit`} onClick={() => setIsMenuOpen(false)}>{t('submit')}</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
