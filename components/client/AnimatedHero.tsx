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
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set([badgeRef.current, headingRef.current, subtitleRef.current, buttonsRef.current], { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (badgeRef.current) {
        tl.fromTo(badgeRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0);
      }

      if (headingRef.current) {
        const words = headingRef.current.innerText.split(' ');
        headingRef.current.innerHTML = words
          .map((w) => `<span class="inline-block overflow-hidden"><span class="inline-block">${w}</span></span>`)
          .join(' ');
        const wordSpans = headingRef.current.querySelectorAll('span span');
        tl.fromTo(wordSpans, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.65, stagger: 0.07 }, 0.2);
      }

      if (subtitleRef.current) {
        tl.fromTo(subtitleRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7 }, 0.65);
      }

      if (buttonsRef.current) {
        const btns = buttonsRef.current.querySelectorAll('a');
        tl.fromTo(btns, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 }, 0.85);
      }
    });
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
            className="text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl leading-[1.05]"
          >
            {isAr ? 'حيث تعيش أيقونات مصر' : 'Where Egypt\'s Icons Live'}
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="mx-auto max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl"
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
            <Button variant="primary" size="lg">
              <Link href={`/${locale}/people`} className="flex items-center gap-2">
                {isAr ? 'استكشف الأيقونات' : 'Explore the Icons'}
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link href={`/${locale}/articles`} className="flex items-center gap-2">
                {isAr ? 'اقرأ القصص' : 'Read Their Stories'}
                <BookOpen size={18} />
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
