'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
<<<<<<< HEAD
import TierBadge from '@/components/ui/TierBadge';
=======
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126

interface Person {
  id: string;
  name: string;
  position: string;
  company: string;
  imageUrl: string | null;
<<<<<<< HEAD
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
=======
  tier: 'gold' | 'silver' | 'bronze';
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
}

interface RotatingCardsProps {
  people: Person[];
  locale?: string;
}

const tierColors = {
<<<<<<< HEAD
  platinum: {
    border: 'border-gold',
    glow: 'shadow-[0_0_25px_rgba(212,168,83,0.4)]',
    bg: 'from-gold/15 to-background',
  },
=======
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
  gold: {
    border: 'border-gold',
    glow: 'shadow-[0_0_20px_rgba(212,168,83,0.3)]',
    bg: 'from-gold/10 to-background',
  },
  silver: {
    border: 'border-gray-400',
    glow: 'shadow-[0_0_20px_rgba(180,180,180,0.2)]',
    bg: 'from-gray-400/5 to-background',
  },
  bronze: {
    border: 'border-amber-600',
    glow: 'shadow-[0_0_20px_rgba(180,100,50,0.2)]',
    bg: 'from-amber-600/5 to-background',
  },
};

const RotatingCards = ({ people, locale = 'en' }: RotatingCardsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);
  const gsapRef = useRef<any>(null);
  const ScrollTriggerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Dynamically import gsap with SSR: false
    import('gsap').then((gsapModule) => {
      import('gsap/ScrollTrigger').then((ScrollTriggerModule) => {
        gsapRef.current = gsapModule.default;
        ScrollTriggerRef.current = ScrollTriggerModule.default;

        const gsap = gsapRef.current;
        const ScrollTrigger = ScrollTriggerRef.current;

        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        const container = containerRef.current;
        const cardsWrapper = cardsWrapperRef.current;

        if (!container || !cardsWrapper) return;

        const cards = cardsWrapper.querySelectorAll('[data-rotating-card]');

<<<<<<< HEAD
        // Subtle scroll-driven entrance animation
        cards.forEach((card, index) => {
          gsap.fromTo(
            card,
            {
              opacity: 0,
              y: 60,
              scale: 0.95,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              delay: index * 0.15,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: container,
                start: 'top 80%',
                end: 'top 30%',
                toggleActions: 'play none none reverse',
                markers: false,
              },
            }
          );
=======
        // Create scroll-driven 3D rotation animation
        cards.forEach((card, index) => {
          const angle = (index / cards.length) * 360;

          gsap.to(card, {
            rotationX: angle * 0.5,
            rotationY: angle * 0.3,
            y: Math.sin(index * (Math.PI / cards.length)) * 30,
            opacity: 0.6 + (index % 2) * 0.4,
            scrollTrigger: {
              trigger: container,
              start: 'top center',
              end: 'bottom center',
              scrub: 1,
              markers: false,
            },
          });
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
        });

        // Cleanup on unmount
        return () => {
          ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
        };
      });
    });
  }, [people.length]);

  return (
    <div
      ref={containerRef}
<<<<<<< HEAD
      className="relative w-full bg-gradient-to-b from-background via-background/95 to-background py-20"
=======
      className="relative w-full min-h-screen bg-gradient-to-b from-background via-background/95 to-background py-20"
      style={{
        perspective: '1200px',
      }}
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-text-primary sm:text-5xl">
            Meet the People
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-3xl mx-auto">
            {locale === 'ar'
              ? 'اكتشف الشخصيات البارزة والرائدة في مجتمعنا'
              : 'Discover remarkable individuals shaping our community'}
          </p>
        </div>

        {/* Cards Container with 3D perspective */}
        <div
          ref={cardsWrapperRef}
          className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
<<<<<<< HEAD
        >
          {people.map((person, index) => {
            const tierColor = tierColors[person.tier] || tierColors.bronze;
=======
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {people.map((person, index) => {
            const tierColor = tierColors[person.tier];
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126

            return (
              <div
                key={person.id}
                data-rotating-card
                className={`group relative rounded-xl overflow-hidden border ${tierColor.border} ${tierColor.glow} transition-all duration-300 hover:scale-105`}
                style={{
<<<<<<< HEAD
                  willChange: 'transform, opacity',
=======
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
                }}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tierColor.bg} z-0`}
                />

                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gold/20 to-background">
                  {person.imageUrl ? (
                    <Image
                      src={person.imageUrl}
                      alt={person.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <svg
                          className="mx-auto h-16 w-16 text-gold/40"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Tier Badge */}
                  <div className="absolute top-4 right-4 z-10">
<<<<<<< HEAD
                    <TierBadge tier={person.tier} size="md" />
=======
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                      ${
                        person.tier === 'gold'
                          ? 'bg-gold text-black'
                          : person.tier === 'silver'
                            ? 'bg-gray-400 text-gray-900'
                            : 'bg-amber-600 text-white'
                      }`}
                    >
                      {person.tier}
                    </span>
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
                  </div>
                </div>

                {/* Content Container */}
                <div className="relative z-10 p-6 space-y-4">
                  {/* Name */}
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary">
                      {person.name}
                    </h3>
                  </div>

                  {/* Position */}
                  <div>
                    <p className="text-gold font-semibold">{person.position}</p>
                    <p className="text-text-secondary text-sm">{person.company}</p>
                  </div>

                  {/* Divider */}
                  <div className="pt-4 border-t border-gold/30" />

                  {/* View Profile Link */}
                  <Link
                    href={`/${locale}/people/${person.id}` as any}
                    className="inline-flex items-center gap-2 text-gold font-semibold hover:gap-3 transition-all duration-300 group/link"
                  >
                    <span>
                      {locale === 'ar' ? 'عرض الملف الشخصي' : 'View Profile'}
                    </span>
                    <svg
                      className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-gold/20 via-transparent to-transparent" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RotatingCards;
