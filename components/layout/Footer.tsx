import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface-elevated">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Demo1 Cairo Live
            </h3>
            <p className="text-sm text-text-secondary">
              Celebrating Egyptian profiles and inspiring stories from across the globe.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/people" className="text-sm text-text-secondary hover:text-gold transition-colors">
                  Browse People
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-sm text-text-secondary hover:text-gold transition-colors">
                  Read Articles
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-sm text-text-secondary hover:text-gold transition-colors">
                  Submit Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/subscribe" className="text-sm text-text-secondary hover:text-gold transition-colors">
                  Subscribe
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-text-secondary hover:text-gold transition-colors">
                  Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-text-secondary hover:text-gold transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-text-secondary">
                <Mail size={16} className="text-gold" />
                <a href="mailto:info@demo1cairolive.com" className="hover:text-gold transition-colors">
                  info@demo1cairolive.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-text-secondary">
                <MapPin size={16} className="text-gold" />
                Cairo, Egypt
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-text-secondary">
              Copyright {currentYear} Demo1 Cairo Live. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-text-secondary hover:text-gold transition-colors">
                Twitter
              </a>
              <a href="#" className="text-text-secondary hover:text-gold transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-text-secondary hover:text-gold transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
