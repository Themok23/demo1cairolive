'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TierBadge from '@/components/ui/TierBadge';

interface Person {
  id: string;
  name: string;
  position: string;
  company: string;
  imageUrl: string | null;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
}

interface RotatingCardsProps {
  people: Person[];
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

    let cleanup: (() => void) | undefined;

    import('gsap').then((gsapModule) => {
      import('gsap/ScrollTrigger').then((STModule) => {
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

        // Cards stagger — alternating from left and right
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

    return () => cleanup?.();
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
              ? 'شخصيات مختارة بعناية — عملهم ورؤيتهم وإرثهم يرسمون ملامح مصر.'
              : 'Handpicked individuals whose work, vision, and legacy define Egypt.'}
          </p>
        </div>

        {/* Cards Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {people.map((person) => (
            <Link
              key={person.id}
              href={`/${locale}/krtk/${person.id}` as any}
              data-card
              className="group block"
            >
              <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-b from-surface-elevated to-surface p-6 transition-all duration-400 hover:border-gold/50 hover:shadow-[0_8px_40px_rgba(212,168,83,0.15)] hover:-translate-y-1">
                {/* Hover shimmer */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

                {/* Top row: avatar + tier badge */}
                <div className="relative z-10 flex items-start justify-between mb-5">
                  {/* Round avatar */}
                  <div
                    data-avatar
                    className="relative h-20 w-20 flex-shrink-0"
                  >
                    {/* Gold ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold via-amber-400 to-gold p-[2px]">
                      <div className="h-full w-full rounded-full overflow-hidden bg-surface">
                        {person.imageUrl ? (
                          <Image
                            src={person.imageUrl}
                            alt={person.name}
                            fill
                            className="object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gold/20 to-surface">
                            <span className="text-2xl font-bold text-gold">
                              {person.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Verified glow dot */}
                    <span className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full bg-gold border-2 border-background block" />
                  </div>

                  {/* Tier badge top-right */}
                  <TierBadge tier={person.tier} size="sm" />
                </div>

                {/* Name + role */}
                <div className="relative z-10 space-y-1.5">
                  <h3 className="text-xl font-bold text-text-primary leading-tight group-hover:text-gold transition-colors duration-250">
                    {person.name}
                  </h3>
                  {person.position && (
                    <p className="text-sm font-semibold text-gold/90 leading-snug">
                      {person.position}
                    </p>
                  )}
                  {person.company && (
                    <p className="text-xs text-text-secondary truncate">
                      {person.company}
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="relative z-10 mt-5 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

                {/* CTA */}
                <div className="relative z-10 mt-4 flex items-center gap-1.5 text-sm font-semibold text-gold/70 group-hover:text-gold transition-colors duration-250">
                  <span>
                    {locale === 'ar' ? 'عرض البطاقة' : 'View Profile'}
                  </span>
                  <svg
                    className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-250"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/people` as any}
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
