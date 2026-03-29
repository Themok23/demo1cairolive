'use client';

import { useRef, useEffect } from 'react';
import FadeIn from '@/components/animations/FadeIn';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function AnimatedHero() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;

    const text = headingRef.current.innerText;
    headingRef.current.innerHTML = text
      .split('')
      .map((char, i) => `<span class="inline-block" style="animation: fadeIn 0.6s ease-out ${i * 0.03}s both">${char}</span>`)
      .join('');

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-40">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-elevated via-surface to-background opacity-60" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-amber/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <FadeIn className="text-center">
          <div className="mb-6 inline-block rounded-full border border-gold/30 bg-gold/5 px-4 py-2">
            <p className="text-sm font-semibold text-gold">Every Egyptian has a story</p>
          </div>
          <h1
            ref={headingRef}
            className="mb-6 text-5xl font-black tracking-tight text-text-primary sm:text-6xl lg:text-7xl"
          >
            Discover Remarkable Egyptians
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-text-secondary sm:text-2xl">
            Celebrate extraordinary achievements, inspiring stories, and remarkable people from Cairo and beyond. Join our growing community of innovators, creators, and thought leaders.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="primary" size="lg">
              <Link href="/people" className="flex items-center gap-2">
                Browse Profiles
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link href="/articles" className="flex items-center gap-2">
                Read Stories
                <BookOpen size={18} />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
