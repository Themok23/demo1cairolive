import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren from '@/components/animations/StaggerChildren';
import { db } from '@/src/infrastructure/db/client';
import { pillars } from '@/src/infrastructure/db/schema';
import { eq, asc } from 'drizzle-orm';
import { localized, type Locale } from '@/src/lib/locale';

interface PillarsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PillarsPage({ params }: PillarsPageProps) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  const loc = locale as Locale;

  const allPillars = await db
    .select()
    .from(pillars)
    .where(eq(pillars.isActive, true))
    .orderBy(asc(pillars.displayOrder), asc(pillars.nameEn));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative border-b border-border/30 bg-gradient-to-b from-surface-elevated via-surface-elevated/50 to-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-40" />
        <div className="relative mx-auto max-w-7xl">
          <FadeIn>
            <div className="mb-6 inline-block rounded-full border border-gold/30 bg-gold/5 px-4 py-2">
              <p className="text-sm font-semibold text-gold">
                {isAr ? 'محاور' : 'Pillars'}
              </p>
            </div>
            <h1 className="mb-4 text-5xl font-bold text-text-primary lg:text-6xl">
              {isAr ? 'استكشف' : 'Explore'}{' '}
              <span className="gradient-text">{isAr ? 'القاهرة' : 'Cairo'}</span>
            </h1>
            <p className="max-w-2xl text-xl text-text-secondary leading-relaxed" lang={locale}>
              {isAr
                ? 'محاور تجمع كل ما يستحق الاستكشاف في القاهرة. من السياحة والمطاعم إلى التراث والفن والتقنية.'
                : 'The lenses through which Cairo unfolds. From tourism and restaurants to heritage, arts, and tech.'}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Pillars Grid */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {allPillars.length > 0 ? (
            <StaggerChildren className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allPillars.map((pillar) => {
                const Icon = pillar.iconKey
                  ? ((Icons as any)[pillar.iconKey] as
                      | React.ComponentType<{ size?: number; className?: string }>
                      | undefined)
                  : undefined;
                const name = localized(loc, pillar.nameEn, pillar.nameAr);
                const description = localized(loc, pillar.descriptionEn, pillar.descriptionAr);

                return (
                  <div key={pillar.id} data-stagger>
                    <Link
                      href={`/${locale}/pillars/${pillar.slug}` as any}
                      className="group relative block overflow-hidden rounded-2xl border border-border bg-surface-elevated transition-all duration-500 hover:border-gold/40 hover:shadow-[0_0_30px_rgba(212,168,83,0.15)] hover:-translate-y-1"
                    >
                      {/* Cover image */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gold/10 to-amber/5">
                        {pillar.coverImageUrl ? (
                          <img
                            src={pillar.coverImageUrl}
                            alt={name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            {Icon ? (
                              <Icon size={64} className="text-gold/40" />
                            ) : (
                              <span className="text-4xl font-bold text-gold/30">
                                {name.charAt(0)}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="relative p-6">
                        <div className="mb-3 flex items-center gap-3">
                          {Icon && (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 ring-1 ring-gold/20">
                              <Icon size={20} className="text-gold" />
                            </div>
                          )}
                          <h2
                            className="text-2xl font-bold text-text-primary transition-colors group-hover:text-gold"
                            lang={locale}
                          >
                            {name}
                          </h2>
                        </div>
                        {description && (
                          <p
                            className="line-clamp-3 text-sm text-text-secondary leading-relaxed"
                            lang={locale}
                          >
                            {description}
                          </p>
                        )}
                        <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gold opacity-0 transition-opacity group-hover:opacity-100">
                          {isAr ? 'استكشف' : 'Explore'}
                          <ArrowRight size={16} className={isAr ? 'rotate-180' : ''} />
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </StaggerChildren>
          ) : (
            <div className="py-20 text-center">
              <p className="text-text-secondary">
                {isAr ? 'لا توجد محاور حالياً' : 'No pillars yet'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
