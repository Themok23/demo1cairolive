'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, MapPin, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const currentYear = new Date().getFullYear();
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscriberLoading, setSubscriberLoading] = useState(false);
  const [subscriberMessage, setSubscriberMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!subscriberEmail || !emailRegex.test(subscriberEmail)) {
      setSubscriberMessage({ type: 'error', text: t('subscribe_error') || 'Please enter a valid email' });
      return;
    }

    setSubscriberLoading(true);
    setSubscriberMessage(null);

    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscriberEmail }),
      });

      const result = await response.json();

      if (result.success) {
        setSubscriberMessage({ type: 'success', text: t('subscribe_success') || 'Successfully subscribed!' });
        setSubscriberEmail('');
      } else {
        setSubscriberMessage({ type: 'error', text: result.error || t('subscribe_error') || 'Subscription failed' });
      }
    } catch (error) {
      setSubscriberMessage({ type: 'error', text: t('subscribe_error') || 'An error occurred' });
    } finally {
      setSubscriberLoading(false);
    }
  };

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gold to-amber" />
              <span className="text-lg font-bold bg-gradient-to-r from-gold to-amber bg-clip-text text-transparent">
                CAIRO LIVE
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {t('aboutText') || 'A platform celebrating extraordinary Egyptian professionals through stories and digital profiles.'}
            </p>
          </div>

          {/* People Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">{t('people') || 'People'}</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href={`/${locale}/people`} className="text-sm text-text-secondary hover:text-gold transition-colors duration-200">
                  {t('browse_people') || 'Browse People'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/krtk`} className="text-sm text-text-secondary hover:text-gold transition-colors duration-200">
                  {t('krtk_directory') || 'KRTK Directory'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/submit`} className="text-sm text-text-secondary hover:text-gold transition-colors duration-200">
                  {t('submit_profile') || 'Submit Profile'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Articles Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">{t('articles') || 'Articles'}</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href={`/${locale}/articles`} className="text-sm text-text-secondary hover:text-gold transition-colors duration-200">
                  {t('read_articles') || 'Read Articles'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/subscribe`} className="text-sm text-text-secondary hover:text-gold transition-colors duration-200">
                  {t('subscribe') || 'Subscribe'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">{t('newsletter') || 'Newsletter'}</h4>
            <p className="text-sm text-text-secondary mb-4">
              {t('newsletterText') || 'Stay updated with the latest stories.'}
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                placeholder={t('email_placeholder') || 'your@email.com'}
                className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-gold focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={subscriberLoading}
                className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-background hover:bg-amber transition-colors disabled:opacity-50"
              >
                {subscriberLoading ? '...' : (t('subscribe_btn') || 'Go')}
              </button>
            </form>
            {subscriberMessage && (
              <p className={`mt-2 text-xs ${subscriberMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {subscriberMessage.text}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
          <p className="text-sm text-text-secondary">
            {t('copyright') || `${currentYear} Cairo Live. All rights reserved.`}
          </p>
          <p className="text-sm text-text-secondary">
            {t('powered_by') || 'Powered by'}{' '}
            <a
              href="https://themok.company"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-amber transition-colors"
            >
              The Mok Company
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
