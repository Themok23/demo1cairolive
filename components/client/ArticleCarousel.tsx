'use client';

<<<<<<< HEAD
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
=======
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImageUrl: string | null;
  publishedAt: Date | null;
}

interface ArticleCarouselProps {
  articles: Article[];
  locale?: string;
}

const ArticleCarousel = ({ articles, locale = 'en' }: ArticleCarouselProps) => {
<<<<<<< HEAD
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 340;
    el.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  // Entrance animation with GSAP
  useEffect(() => {
    if (typeof window === 'undefined') return;

    import('gsap').then((gsapModule) => {
      import('gsap/ScrollTrigger').then((ScrollTriggerModule) => {
        const gsap = gsapModule.default;
        const ScrollTrigger = ScrollTriggerModule.default;
        gsap.registerPlugin(ScrollTrigger);

        const section = sectionRef.current;
        if (!section) return;

        // Animate heading
        const heading = section.querySelector('[data-heading]');
        if (heading) {
          gsap.fromTo(
            heading,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        // Animate cards with stagger
        const cards = section.querySelectorAll('[data-article-card]');
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );

=======
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
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

        const container = scrollContainerRef.current;
        const cardsContainer = cardsRef.current;

        if (!container || !cardsContainer) return;

        const cards = cardsContainer.querySelectorAll('[data-article-card]');

        // Calculate total scroll distance needed
        const cardWidth = (cards[0] as HTMLElement)?.offsetWidth || 0;
        const totalDistance = (cardWidth + 16) * cards.length; // 16 for gap

        // Create the horizontal scroll animation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 1.2, // Smooth scrub animation
            start: 'top top',
            end: `+=${totalDistance}`,
            markers: false,
          },
        });

        // Animate cards horizontally
        tl.to(cardsContainer, {
          x: -totalDistance,
          duration: 1,
          ease: 'power1.inOut',
        });

        // Stagger animation for cards entrance
        cards.forEach((card, index) => {
          gsap.fromTo(
            card,
            {
              opacity: 0,
              y: 30,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: index * 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: container,
                start: 'top 80%',
              },
            }
          );
        });

        // Cleanup on unmount
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
        return () => {
          ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
        };
      });
    });
  }, [articles.length]);

<<<<<<< HEAD
  if (!articles.length) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-bold text-text-primary">Featured Articles</h2>
          <p className="mt-4 text-text-secondary">No articles yet. Check back soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative py-20 bg-background">
      {/* Header with nav arrows */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10" data-heading>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-bold text-text-primary sm:text-5xl">
              Featured Articles
            </h2>
            <p className="mt-3 text-lg text-text-secondary">
              Discover stories and insights from remarkable Egyptians
            </p>
          </div>

          {/* Desktop nav arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-2.5 rounded-full border border-border bg-surface hover:bg-surface-elevated hover:border-gold/50 text-text-secondary hover:text-gold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-2.5 rounded-full border border-border bg-surface hover:bg-surface-elevated hover:border-gold/50 text-text-secondary hover:text-gold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable cards row */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Left spacer for max-w-7xl alignment on large screens */}
          <div className="hidden lg:block flex-shrink-0" style={{ width: 'calc((100vw - 80rem) / 2)' }} />

          {articles.map((article) => (
=======
  return (
    <div
      ref={scrollContainerRef}
      className="relative w-full overflow-hidden bg-background py-20"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-text-primary sm:text-5xl">
            Featured Articles
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Discover stories and insights from remarkable Egyptians
          </p>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full overflow-hidden">
        <div
          ref={cardsRef}
          className="flex gap-4 px-4 sm:px-6 lg:px-8"
          style={{
            willChange: 'transform',
          }}
        >
          {articles.map((article, index) => (
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
            <Link
              key={article.id}
              href={`/${locale}/articles/${article.slug}`}
              data-article-card
<<<<<<< HEAD
              className="group relative flex-shrink-0 overflow-hidden rounded-xl border border-border/50 hover:border-gold/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,168,83,0.15)] snap-start"
              style={{ width: '320px' }}
            >
              {/* Image area */}
              <div className="relative w-full h-48 bg-surface overflow-hidden">
=======
              className="group relative flex-shrink-0 overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105"
              style={{
                width: '280px',
                aspectRatio: '3 / 4',
              }}
            >
              {/* Image */}
              <div className="relative w-full h-full bg-gradient-to-br from-gold/20 to-background">
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
                {article.featuredImageUrl ? (
                  <Image
                    src={article.featuredImageUrl}
                    alt={article.title}
                    fill
<<<<<<< HEAD
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface to-surface-elevated">
                    <svg
                      className="h-10 w-10 text-gold/30"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                {/* Subtle gold line at top */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content area */}
              <div className="p-5 bg-surface flex flex-col" style={{ minHeight: '180px' }}>
                {/* Date */}
                {article.publishedAt && (
                  <p className="text-xs text-text-secondary mb-2 font-medium uppercase tracking-wider">
                    {new Date(article.publishedAt).toLocaleDateString(
                      locale === 'ar' ? 'ar-EG' : 'en-US',
                      { year: 'numeric', month: 'short', day: 'numeric' }
                    )}
                  </p>
                )}

                {/* Title */}
                <h3 className="text-lg font-bold text-text-primary leading-snug line-clamp-2 mb-2 group-hover:text-gold transition-colors duration-200">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-text-secondary line-clamp-2 flex-grow">
                  {article.excerpt}
                </p>

                {/* Read More */}
                <div className="mt-4 flex items-center gap-1.5 text-gold text-sm font-semibold group-hover:gap-2.5 transition-all duration-300">
                  <span>{locale === 'ar' ? 'اقرأ المزيد' : 'Read More'}</span>
                  <ChevronRight size={14} className="mt-px" />
=======
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gold/40"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-2">
                  {article.title}
                </h3>

                {/* Description - Slides up on hover */}
                <div className="overflow-hidden max-h-0 group-hover:max-h-24 transition-all duration-300">
                  <div className="pt-2 border-t border-gold/50 space-y-2">
                    <p className="text-sm text-gray-200 line-clamp-3">
                      {article.excerpt}
                    </p>
                    {article.publishedAt && (
                      <p className="text-xs text-gold/80">
                        {new Date(article.publishedAt).toLocaleDateString(
                          locale === 'ar' ? 'ar-EG' : 'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {/* Read More Link */}
                <div className="mt-4 flex items-center gap-2 text-gold text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                  <span>{locale === 'ar' ? 'اقرأ المزيد' : 'Read More'}</span>
                  <svg
                    className="w-4 h-4"
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
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
                </div>
              </div>
            </Link>
          ))}
<<<<<<< HEAD

          {/* View All card */}
          <Link
            href={`/${locale}/articles`}
            data-article-card
            className="group relative flex-shrink-0 overflow-hidden rounded-xl border border-border/50 hover:border-gold/40 transition-all duration-300 flex items-center justify-center snap-start"
            style={{ width: '320px', minHeight: '380px' }}
          >
            <div className="text-center p-8">
              <div className="w-14 h-14 rounded-full border-2 border-gold/40 flex items-center justify-center mx-auto mb-4 group-hover:border-gold group-hover:bg-gold/10 transition-all duration-300">
                <ChevronRight size={24} className="text-gold" />
              </div>
              <p className="text-lg font-semibold text-text-primary group-hover:text-gold transition-colors duration-200">
                {locale === 'ar' ? 'عرض الكل' : 'View All Articles'}
              </p>
              <p className="text-sm text-text-secondary mt-1">
                {locale === 'ar' ? 'تصفح جميع المقالات' : 'Browse the full collection'}
              </p>
            </div>
          </Link>

          {/* Right spacer */}
          <div className="flex-shrink-0 w-4 sm:w-6 lg:w-8" />
        </div>

        {/* Left fade */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        )}

        {/* Right fade */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
        )}
      </div>
    </section>
=======
        </div>
      </div>

      {/* Right Gradient Fade */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
    </div>
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
  );
};

export default ArticleCarousel;
