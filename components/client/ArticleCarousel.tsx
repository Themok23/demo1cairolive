'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

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
        return () => {
          ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
        };
      });
    });
  }, [articles.length]);

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
            <Link
              key={article.id}
              href={`/${locale}/articles/${article.slug}`}
              data-article-card
              className="group relative flex-shrink-0 overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105"
              style={{
                width: '280px',
                aspectRatio: '3 / 4',
              }}
            >
              {/* Image */}
              <div className="relative w-full h-full bg-gradient-to-br from-gold/20 to-background">
                {article.featuredImageUrl ? (
                  <Image
                    src={article.featuredImageUrl}
                    alt={article.title}
                    fill
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
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Right Gradient Fade */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default ArticleCarousel;
