'use client';

import { useRef, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import HeroCanvas from './HeroCanvas';

interface AnimatedHeroProps {
  locale?: string;
}

export default function AnimatedHero({ locale = 'en' }: AnimatedHeroProps) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const isAr = locale === 'ar';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    import('gsap').then((gsapModule) => {
      const gsap = gsapModule.default;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        gsap.set([badgeRef.current, headingRef.current, subtitleRef.current, buttonsRef.current], {
          opacity: 1,
          y: 0,
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'cubic.out' } });

      // Badge animation: fade in + slide up
      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          0
        );
      }

      // Heading animation: split into words
      if (headingRef.current) {
        const headingText = headingRef.current.innerText;
        const words = headingText.split(' ');
        headingRef.current.innerHTML = words
          .map((word) => `<span class="inline-block overflow-hidden"><span class="inline-block">${word}</span></span>`)
          .join(' ');

        const wordSpans = headingRef.current.querySelectorAll('span span');
        tl.fromTo(
          wordSpans,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          0.2
        );
      }

      // Subtitle animation: fade in
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          0.6
        );
      }

      // Buttons animation: slide in with stagger
      if (buttonsRef.current) {
        const buttons = buttonsRef.current.querySelectorAll('button, a');
        tl.fromTo(
          buttons,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
          0.8
        );
      }
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-40"
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
    >
      {/* Hero Canvas Background */}
      <HeroCanvas />

      {/* Semi-transparent overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-background/30 z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl w-full z-20">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div
            ref={badgeRef}
            className="inline-block rounded-full border border-gold/40 bg-gold/8 px-4 py-2 backdrop-blur-sm"
          >
            <p className="text-sm font-semibold text-gold">
              {isAr ? 'كل مصري لديه قصة' : 'Every Egyptian has a story'}
            </p>
          </div>

          {/* Main Heading */}
          <h1
            ref={headingRef}
            className="text-5xl font-black tracking-tight text-text-primary sm:text-6xl lg:text-7xl leading-tight"
          >
            {isAr ? 'اكتشف المصريين المتميزين' : 'Discover Remarkable Egyptians'}
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="mx-auto max-w-3xl text-xl leading-relaxed text-text-secondary sm:text-2xl"
          >
            {isAr
              ? 'احتفل بالإنجازات الاستثنائية والقصص الملهمة والأشخاص المتميزين من القاهرة وخارجها. انضم إلى مجتمعنا المتنامي من المبتكرين والمبدعين وقادة الفكر.'
              : 'Celebrate extraordinary achievements, inspiring stories, and remarkable people from Cairo and beyond. Join our growing community of innovators, creators, and thought leaders.'}
          </p>

          {/* CTA Buttons */}
          <div
            ref={buttonsRef}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button variant="primary" size="lg">
              <Link href={`/${locale}/people`} className="flex items-center gap-2">
                {isAr ? 'تصفح الملفات' : 'Browse Profiles'}
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link href={`/${locale}/articles`} className="flex items-center gap-2">
                {isAr ? 'اقرأ القصص' : 'Read Stories'}
                <BookOpen size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
