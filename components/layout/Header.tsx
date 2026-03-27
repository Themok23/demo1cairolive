'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gold" />
            <span className="text-xl font-bold text-text-primary">
              Demo1 Cairo Live
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden gap-8 md:flex">
            <Link href="/people" className="text-text-secondary hover:text-text-primary transition-colors">
              People
            </Link>
            <Link href="/articles" className="text-text-secondary hover:text-text-primary transition-colors">
              Articles
            </Link>
            <Link href="/krtk" className="text-text-secondary hover:text-text-primary transition-colors">
              KRTK
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden gap-3 md:flex">
            <Button variant="outline" size="sm">
              <Link href="/subscribe">Subscribe</Link>
            </Button>
            <Button variant="primary" size="sm">
              <Link href="/submit">Submit Profile</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-text-primary hover:text-gold transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-border pb-4 md:hidden">
            <div className="flex flex-col gap-4 py-4">
              <Link href="/people" className="text-text-secondary hover:text-text-primary">
                People
              </Link>
              <Link href="/articles" className="text-text-secondary hover:text-text-primary">
                Articles
              </Link>
              <Link href="/krtk" className="text-text-secondary hover:text-text-primary">
                KRTK
              </Link>
              <div className="border-t border-border pt-4">
                <Button variant="outline" size="sm" className="w-full mb-2">
                  <Link href="/subscribe">Subscribe</Link>
                </Button>
                <Button variant="primary" size="sm" className="w-full">
                  <Link href="/submit">Submit Profile</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
