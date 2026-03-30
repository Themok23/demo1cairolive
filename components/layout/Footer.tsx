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
    if (!subscriberEmail || !subscriberEmail.includes('@')) {
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
<<<<<<< HEAD
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
=======
    <footer className="border-t border-[#2a2a3a] bg-[#0a0a0f]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          {/* Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#D4A853] to-[#E8C97A]" />
              <span className="text-lg font-bold bg-gradient-to-r from-[#D4A853] to-[#E8C97A] bg-clip-text text-transparent">
                CAIRO LIVE
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('about') || 'Celebrating extraordinary Egyptians and their remarkable stories.'}
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
            </p>
          </div>

          {/* People Links */}
          <div>
<<<<<<< HEAD
            <h4 className="font-semibold text-text-primary mb-4">{t('people') || 'People'}</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href={`/${locale}/people`} className="text-sm text-text-secondary hover:text-gold transition-colors duration-200">
=======
            <h4 className="font-semibold text-white mb-4">{t('people') || 'People'}</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href={`/${locale}/people`} className="text-sm text-gray-400 hover:text-[#D4A853] transition-colors duration-200">
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
                  {t('browse_people') || 'Browse People'}
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link href={`/${locale}/krtk`} className="text-sm text-text-secondary hover:text-gold transition-colors duration-200">
=======
                <Link href={`/${locale}/krtk`} className="text-sm text-gray-400 hover:text-[#D4A853] transition-colors duration-200">
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
                  {t('krtk_directory') || 'KRTK Directory'}
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link href={`/${locale}/submit`} className="text-sm text-text-secondary hover:text-gold transition-colors duration-200">
=======
                <Link href={`/${locale}/submit`} className="text-sm text-gray-400 hover:text-[#D4A853] transition-colors duration-200">
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
                  {t('submit_profile') || 'Submit Profile'}
                </Link>
              </li>
            </ul>
          </div>

<<<<<<< HEAD
          {/* Articles Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">{t('articles') || 'Articles'}</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href={`/${locale}/articles`} className="text-sm text-text-secondary hover:text-gold transition-colors duration-200">
=======
          {/* Articles & Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t('articles') || 'Articles'}</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href={`/${locale}/articles`} className="text-sm text-gray-400 hover:text-[#D4A853] transition-colors duration-200">
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
                  {t('read_articles') || 'Read Articles'}
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link href={`/${locale}/subscribe`} className="text-sm text-text-secondary hover:text-gold transition-colors duration-200">
                  {t('subscribe') || 'Subscribe'}
                </Link>
=======
                <Link href={`/${locale}/subscribe`} className="text-sm text-gray-400 hover:text-[#D4A853] transition-colors duration-200">
                  {t('subscribe') || 'Subscribe'}
                </Link>
              </li>
              <li>
                <a href="https://themok.company" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-[#D4A853] transition-colors duration-200">
                  {t('mok_company') || 'The Mok Company'}
                </a>
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
              </li>
            </ul>
          </div>

<<<<<<< HEAD
          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">{t('newsletter') || 'Newsletter'}</h4>
            <p className="text-sm text-text-secondary mb-4">
              {t('newsletterText') || 'Stay updated with the latest stories.'}
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
=======
          {/* Connect & Social */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t('connect') || 'Connect'}</h4>
            <ul className="space-y-3 mb-4">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={16} className="text-[#D4A853]" />
                <a href="mailto:hello@cairolive.com" className="hover:text-[#D4A853] transition-colors duration-200">
                  hello@cairolive.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin size={16} className="text-[#D4A853]" />
                Cairo, Egypt
              </li>
            </ul>
            <div className="flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-400 hover:text-[#D4A853] hover:bg-gray-900/50 transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-400 hover:text-[#D4A853] hover:bg-gray-900/50 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-400 hover:text-[#D4A853] hover:bg-gray-900/50 transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t('newsletter') || 'Newsletter'}</h4>
            <form onSubmit={handleSubscribe} className="space-y-2">
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
              <input
                type="email"
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                placeholder={t('email_placeholder') || 'your@email.com'}
<<<<<<< HEAD
                className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-gold focus:outline-none transition-colors"
=======
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A853] transition-colors duration-200"
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
              />
              <button
                type="submit"
                disabled={subscriberLoading}
<<<<<<< HEAD
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
=======
                className="w-full px-3 py-2 bg-[#D4A853] text-[#0a0a0f] rounded-lg text-sm font-medium hover:bg-[#E8C97A] transition-colors duration-200 disabled:opacity-50"
              >
                {subscriberLoading ? t('subscribing') || 'Subscribing...' : t('subscribe_btn') || 'Subscribe'}
              </button>
              {subscriberMessage && (
                <p className={`text-xs ${subscriberMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {subscriberMessage.text}
                </p>
              )}
            </form>
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
          </div>
        </div>

        {/* Bottom Bar */}
<<<<<<< HEAD
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
=======
        <div className="mt-12 border-t border-[#2a2a3a] pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row text-sm text-gray-400">
            <p>
              {t('copyright') || `Copyright ${currentYear} Cairo Live. All rights reserved.`}
            </p>
            <p>
              {t('powered_by') || 'Powered by'} <a href="https://themok.company" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#D4A853] hover:text-[#E8C97A] transition-colors duration-200">The Mok Company</a>
            </p>
          </div>
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
        </div>
      </div>
    </footer>
  );
}
