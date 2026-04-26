'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Menu, X, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTranslations } from 'next-intl';
import PillarsMenu from '@/components/layout/PillarsMenu';

interface PillarMenuItem {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  iconKey: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
}

export default function Header() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [pillars, setPillars] = useState<PillarMenuItem[]>([]);
  const t = useTranslations('nav');
  const isAr = locale === 'ar';

  // Fetch pillars once on mount
  useEffect(() => {
    fetch('/api/pillars')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => Array.isArray(data) && setPillars(data))
      .catch(() => setPillars([]));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-border/50 bg-surface/80 backdrop-blur-xl shadow-lg'
          : 'border-b border-border/30 bg-surface/40 backdrop-blur-md'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gold to-amber shadow-lg group-hover:shadow-xl transition-shadow duration-300" />
            <span className="text-lg font-bold bg-gradient-to-r from-gold via-amber to-gold bg-clip-text text-transparent">
              CAIRO LIVE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden gap-8 md:flex items-center">
            <PillarsMenu
              pillars={pillars}
              locale={locale}
              label={isAr ? 'محاور' : 'Explore'}
            />
            <Link
              href={`/${locale}/places`}
              className="text-sm font-medium text-text-secondary hover:text-gold transition-colors duration-200"
            >
              {isAr ? 'أماكن' : 'Places'}
            </Link>
            <Link
              href={`/${locale}/map`}
              className="text-sm font-medium text-text-secondary hover:text-gold transition-colors duration-200"
            >
              {isAr ? 'خريطة' : 'Map'}
            </Link>
            <Link
              href={`/${locale}/people`}
              className="text-sm font-medium text-text-secondary hover:text-gold transition-colors duration-200"
            >
              {t('people')}
            </Link>
            <Link
              href={`/${locale}/articles`}
              className="text-sm font-medium text-text-secondary hover:text-gold transition-colors duration-200"
            >
              {t('articles')}
            </Link>
            <Link
              href={`/${locale}/krtk`}
              className="text-sm font-medium text-text-secondary hover:text-gold transition-colors duration-200"
            >
              {t('krtk')}
            </Link>
          </div>

          {/* CTA Buttons & Controls */}
          <div className="hidden gap-2 md:flex items-center">
            <ThemeToggle />
            <LanguageSwitcher />
            <Button variant="outline" size="sm">
              <Link href={`/${locale}/subscribe`}>{t('subscribe')}</Link>
            </Button>
            <Button variant="primary" size="sm">
              <Link href={`/${locale}/submit`}>{t('submit')}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button & Controls */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center text-text-primary hover:text-gold transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="animate-in fade-in slide-in-from-top-2 border-t border-border/30 bg-surface/95 backdrop-blur-lg pb-4 md:hidden">
            <div className="flex flex-col gap-1 py-4">
              {/* Pillars accordion section */}
              {pillars.length > 0 && (
                <div className="px-4 py-2">
                  <p className="text-xs font-bold text-text-secondary/60 uppercase tracking-wider mb-2">
                    {isAr ? 'محاور' : 'Explore'}
                  </p>
                  <div className="space-y-1">
                    {pillars.map((p) => {
                      const name = isAr && p.nameAr ? p.nameAr : p.nameEn;
                      return (
                        <Link
                          key={p.id}
                          href={`/${locale}/pillars/${p.slug}` as any}
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-3 py-2 text-sm font-medium text-text-primary hover:text-gold hover:bg-gold/5 rounded transition-colors"
                          lang={locale}
                        >
                          {name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="border-t border-border/20 my-2 mx-4" />
              <Link
                href={`/${locale}/people`}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-gold hover:bg-surface-elevated rounded transition-colors duration-200"
              >
                {t('people')}
              </Link>
              <Link
                href={`/${locale}/articles`}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-gold hover:bg-surface-elevated rounded transition-colors duration-200"
              >
                {t('articles')}
              </Link>
              <Link
                href={`/${locale}/krtk`}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-gold hover:bg-surface-elevated rounded transition-colors duration-200"
              >
                {t('krtk')}
              </Link>
              <div className="flex gap-2 px-4 pt-2">
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
