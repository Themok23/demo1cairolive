'use client';

import { useRef, useEffect } from 'react';
import { ButtonLink } from '@/components/ui/Button';
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

    let cancelled = false;
    let timeline: any;

    import('gsap').then((gsapModule) => {
      if (cancelled) return;
      const gsap = gsapModule.default;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set([badgeRef.current, headingRef.current, subtitleRef.current, buttonsRef.current], { opacity: 1, y: 0 });
        return;
      }

      timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (badgeRef.current) {
        timeline.fromTo(badgeRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0);
      }

      if (headingRef.current) {
        const words = headingRef.current.innerText.split(' ');
        headingRef.current.innerHTML = words
          .map((w) => `<span class="inline-block" style="overflow:hidden;padding-bottom:0.12em;margin-bottom:-0.12em"><span class="inline-block">${w}</span></span>`)
          .join(' ');
        const wordSpans = headingRef.current.querySelectorAll('span span');
        timeline.fromTo(wordSpans, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.65, stagger: 0.07 }, 0.2);
      }

      if (subtitleRef.current) {
        timeline.fromTo(subtitleRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7 }, 0.65);
      }

      if (buttonsRef.current) {
        const btns = buttonsRef.current.querySelectorAll('a');
        timeline.fromTo(btns, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 }, 0.85);
      }
    });

    return () => {
      cancelled = true;
      timeline?.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-40"
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
    >
      <HeroCanvas />

      {/* Readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-background/40 z-10 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl w-full z-20">
        <div className="text-center space-y-8">

          {/* Eyebrow */}
          <div
            ref={badgeRef}
            className="inline-block rounded-full border border-gold/40 bg-gold/8 px-5 py-2 backdrop-blur-sm"
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-gold">
              {isAr ? 'موسوعة أيقونات مصر' : "Egypt's Icons Directory"}
            </p>
          </div>

          {/* Main Heading */}
          <h1
            ref={headingRef}
            className="text-5xl font-black tracking-tight text-text-primary sm:text-7xl lg:text-8xl leading-[1.05]"
          >
            {isAr ? 'حيث تعيش أيقونات مصر' : 'Where Egypt\'s Icons Live'}
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="mx-auto max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl"
          >
            {isAr
              ? 'مجموعة مختارة بعناية من الشخصيات الاستثنائية التي تشكّل ثقافة مصر وصناعتها ومستقبلها — قصة تلو الأخرى.'
              : 'A curated collection of the extraordinary people shaping Egypt\'s culture, industry, and future — one story at a time.'}
          </p>

          {/* CTAs */}
          <div
            ref={buttonsRef}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <ButtonLink href={`/${locale}/people`} variant="primary" size="lg" className="gap-2">
              {isAr ? 'استكشف الأيقونات' : 'Explore the Icons'}
              <ArrowRight size={18} />
            </ButtonLink>
            <ButtonLink href={`/${locale}/articles`} variant="outline" size="lg" className="gap-2">
              {isAr ? 'اقرأ القصص' : 'Read Their Stories'}
              <BookOpen size={18} />
            </ButtonLink>
          </div>

        </div>
      </div>
    </section>
  );
}
