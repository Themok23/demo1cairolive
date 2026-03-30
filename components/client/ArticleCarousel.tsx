'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TaggedPerson {
  id: string;
  name: string;
  imageUrl: string | null;
}

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImageUrl: string | null;
  publishedAt: Date | null;
  taggedPeople?: TaggedPerson[];
}

interface ArticleCarouselProps {
  articles: Article[];
  locale?: string;
}

const ArticleCarousel = ({ articles, locale = 'en' }: ArticleCarouselProps) => {
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
    el.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' });
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    import('gsap').then(({ default: gsap }) => {
      import('gsap/ScrollTrigger').then(({ default: ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const section = sectionRef.current;
        if (!section) return;

        const heading = section.querySelector('[data-heading]');
        if (heading) {
          gsap.fromTo(heading,
            { opacity: 0, y: 28 },
            {
              opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
              scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
            }
          );
        }

        const cards = section.querySelectorAll('[data-article-card]');
        gsap.fromTo(cards,
          { opacity: 0, y: 44, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.6, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none reverse' },
          }
        );

        return () => ScrollTrigger.getAll().forEach((t: any) => t.kill());
      });
    });
  }, [articles.length]);

  if (!articles.length) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-bold text-text-primary">The Stories</h2>
          <p className="mt-4 text-text-secondary">No articles yet. Check back soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10" data-heading>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-bold text-text-primary sm:text-5xl">
              {locale === 'ar' ? '\u0627\u0644\u0642\u0635\u0635' : 'The Stories'}
            </h2>
            <p className="mt-3 text-lg text-text-secondary">
              {locale === 'ar'
                ? '\u0631\u0648\u0627\u064a\u0627\u062a \u0637\u0648\u064a\u0644\u0629 \u0639\u0646 \u0627\u0644\u0646\u0627\u0633 \u0648\u0627\u0644\u0623\u0641\u0643\u0627\u0631 \u0648\u0627\u0644\u062d\u0631\u0643\u0627\u062a \u0627\u0644\u062a\u064a \u062a\u0634\u0643\u0651\u0644 \u0645\u0635\u0631.'
                : 'Long-form stories on the people, ideas, and movements shaping Egypt.'}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={() => scroll('left')} disabled={!canScrollLeft}
              className="p-2.5 rounded-full border border-border bg-surface hover:bg-surface-elevated hover:border-gold/50 text-text-secondary hover:text-gold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Scroll left"><ChevronLeft size={20} /></button>
            <button onClick={() => scroll('right')} disabled={!canScrollRight}
              className="p-2.5 rounded-full border border-border bg-surface hover:bg-surface-elevated hover:border-gold/50 text-text-secondary hover:text-gold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Scroll right"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
        >
          <div className="hidden lg:block flex-shrink-0" style={{ width: 'calc((100vw - 80rem) / 2)' }} />

          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/${locale}/articles/${article.slug}`}
              data-article-card
              className="group relative flex-shrink-0 overflow-hidden rounded-xl snap-start"
              style={{ width: '280px', height: '400px' }}
            >
              <div className="absolute inset-0">
                {article.featuredImageUrl ? (
                  <Image src={article.featuredImageUrl} alt={article.title} fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-surface to-surface-elevated" />
                )}
              </div>

              {/* Permanent base gradient — title always readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

              {/* Hover gradient — deepens shadow to reveal description */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Gold ring */}
              <div className="absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-gold/50 transition-all duration-300" />

              {article.publishedAt && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-xs font-medium uppercase tracking-widest text-white/70 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    {new Date(article.publishedAt).toLocaleDateString(
                      locale === 'ar' ? 'ar-EG' : 'en-US',
                      { month: 'short', day: 'numeric', year: 'numeric' }
                    )}
                  </span>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
                {article.taggedPeople && article.taggedPeople.length > 0 && (
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {article.taggedPeople.map((person) => (
                        <div key={person.id} className="h-7 w-7 rounded-full border-2 border-white/20 overflow-hidden bg-surface flex-shrink-0" title={person.name}>
                          {person.imageUrl ? (
                            <Image src={person.imageUrl} alt={person.name} width={28} height={28} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gold/30 flex items-center justify-center text-[10px] font-bold text-gold">{person.name.charAt(0)}</div>
                          )}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-white/60 font-medium truncate">{article.taggedPeople.map(p => p.name.split(' ')[0]).join(' & ')}</span>
                  </div>
                )}
                <h3 className="text-base font-bold text-white leading-snug line-clamp-2">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-white/75 line-clamp-3 leading-relaxed opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                  {article.excerpt}
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 text-gold text-xs font-semibold uppercase tracking-wider opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75 ease-out">
                  <span>{locale === 'ar' ? '\u0627\u0642\u0631\u0623 \u0627\u0644\u0645\u0632\u064a\u062f' : 'Read More'}</span>
                  <ChevronRight size={11} className="mt-px" />
                </div>
              </div>
            </Link>
          ))}

          <Link href={`/${locale}/articles`} data-article-card
            className="group relative flex-shrink-0 overflow-hidden rounded-xl border border-border/50 hover:border-gold/40 transition-all duration-300 flex items-center justify-center snap-start bg-surface"
            style={{ width: '280px', height: '400px' }}>
            <div className="text-center p-8">
              <div className="w-14 h-14 rounded-full border-2 border-gold/40 flex items-center justify-center mx-auto mb-4 group-hover:border-gold group-hover:bg-gold/10 transition-all duration-300">
                <ChevronRight size={24} className="text-gold" />
              </div>
              <p className="text-lg font-semibold text-text-primary group-hover:text-gold transition-colors duration-200">
                {locale === 'ar' ? '\u0627\u0644\u0645\u0632\u064a\u062f \u0645\u0646 \u0627\u0644\u0642\u0635\u0635' : 'Read All Stories'}
              </p>
              <p className="text-sm text-text-secondary mt-1">
                {locale === 'ar' ? '\u0627\u0633\u062a\u0643\u0634\u0641 \u0627\u0644\u0623\u0631\u0634\u064a\u0641 \u0627\u0644\u0643\u0627\u0645\u0644' : 'Explore the full archive'}
              </p>
            </div>
          </Link>

          <div className="flex-shrink-0 w-4 sm:w-6 lg:w-8" />
        </div>

        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
        )}
      </div>
    </section>
  );
};

export default ArticleCarousel;
