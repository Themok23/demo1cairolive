'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTranslations } from 'next-intl';

export default function Header() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const t = useTranslations('nav');

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
          <div className="hidden gap-8 md:flex">
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
            <div className="flex flex-col gap-4 py-4">
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
