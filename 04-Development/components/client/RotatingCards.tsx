'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Krtk, { type KrtkPerson } from '@/components/micro-krtk/Krtk';

interface RotatingCardsProps {
  people: KrtkPerson[];
  locale?: string;
}

const RotatingCards = ({ people, locale = 'en' }: RotatingCardsProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    import('gsap').then((gsapModule) => {
      if (cancelled) return;
      import('gsap/ScrollTrigger').then((STModule) => {
        if (cancelled) return;
        const gsap = gsapModule.default;
        const ScrollTrigger = STModule.default;
        gsap.registerPlugin(ScrollTrigger);

        const section = sectionRef.current;
        const heading = headingRef.current;
        const grid = gridRef.current;
        if (!section || !heading || !grid) return;

        const cards = grid.querySelectorAll('[data-card]');

        // Heading reveal
        gsap.fromTo(
          heading,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );

        // Cards stagger - alternating from left and right
        cards.forEach((card, i) => {
          const fromLeft = i % 2 === 0;
          gsap.fromTo(
            card,
            {
              opacity: 0,
              x: fromLeft ? -50 : 50,
              y: 30,
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.75,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
              delay: (i % 3) * 0.08,
            }
          );
        });

        // Subtle float animation on each card avatar after scroll-in
        cards.forEach((card) => {
          const avatar = card.querySelector('[data-avatar]');
          if (!avatar) return;
          gsap.to(avatar, {
            y: -6,
            duration: 2.5 + Math.random() * 1,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 2,
          });
        });

        cleanup = () => {
          ScrollTrigger.getAll().forEach((t: any) => t.kill());
        };
      });
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [people.length]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-gradient-to-b from-background via-background/95 to-background py-24 overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-gold/4 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full bg-gold/3 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div ref={headingRef} className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold/70">
            {locale === 'ar' ? 'الأيقونات' : 'Icons'}
          </p>
          <h2 className="text-4xl font-bold text-text-primary sm:text-5xl">
            {locale === 'ar' ? (
              <>أيقونات <span className="gradient-text">مصر</span></>
            ) : (
              <>Egypt's <span className="gradient-text">Icons</span></>
            )}
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            {locale === 'ar'
              ? 'شخصيات مختارة بعناية - عملهم ورؤيتهم وإرثهم يرسمون ملامح مصر.'
              : 'Handpicked individuals whose work, vision, and legacy define Egypt.'}
          </p>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {people.map((person) => (
            <Krtk
              key={person.id}
              person={person}
              locale={locale}
              data-card
            />
          ))}
        </div>

        {/* View all link */}
        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/people`}
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-6 py-2.5 text-sm font-semibold text-gold/80 transition-all duration-300 hover:border-gold hover:text-gold hover:shadow-[0_0_20px_rgba(212,168,83,0.2)]"
          >
            {locale === 'ar' ? 'عرض كل الأيقونات' : 'View All Icons'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RotatingCards;
