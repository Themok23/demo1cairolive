import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/30 bg-gradient-to-b from-surface-elevated/50 to-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gold to-amber" />
              <span className="text-lg font-bold bg-gradient-to-r from-gold to-amber bg-clip-text text-transparent">
                CAIRO LIVE
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Celebrating extraordinary Egyptians and their remarkable stories. Every person has a story worth sharing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Navigation</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/people" className="text-sm text-text-secondary hover:text-gold transition-colors duration-200">
                  Browse People
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-sm text-text-secondary hover:text-gold transition-colors duration-200">
                  Read Articles
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-sm text-text-secondary hover:text-gold transition-colors duration-200">
                  Submit Profile
                </Link>
              </li>
              <li>
                <Link href="/krtk" className="text-sm text-text-secondary hover:text-gold transition-colors duration-200">
                  KRTK Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Resources</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/subscribe" className="text-sm text-text-secondary hover:text-gold transition-colors duration-200">
                  Subscribe
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-text-secondary hover:text-gold transition-colors duration-200">
                  Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-text-secondary hover:text-gold transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-text-secondary hover:text-gold transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Connect</h4>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm text-text-secondary hover:text-gold transition-colors duration-200">
                <Mail size={16} className="text-gold" />
                <a href="mailto:hello@cairolive.com">
                  hello@cairolive.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-text-secondary">
                <MapPin size={16} className="text-gold" />
                Cairo, Egypt
              </li>
            </ul>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 rounded-lg text-text-secondary hover:text-gold hover:bg-surface-elevated transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg text-text-secondary hover:text-gold hover:bg-surface-elevated transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg text-text-secondary hover:text-gold hover:bg-surface-elevated transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border/20 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-text-secondary">
              Copyright {currentYear} Cairo Live. All rights reserved.
            </p>
            <p className="text-sm text-text-secondary">
              Powered by <span className="font-semibold text-gold">The Mok Company</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
