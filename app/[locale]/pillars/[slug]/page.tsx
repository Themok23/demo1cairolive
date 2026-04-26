import Link from 'next/link';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import * as Icons from 'lucide-react';
import { notFound } from 'next/navigation';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren from '@/components/animations/StaggerChildren';
import { db } from '@/src/infrastructure/db/client';
import { pillars, places } from '@/src/infrastructure/db/schema';
import { and, asc, desc, eq } from 'drizzle-orm';
import { localized, type Locale } from '@/src/lib/locale';

interface PillarPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function PillarPage({ params }: PillarPageProps) {
  const { locale, slug } = await params;
  const isAr = locale === 'ar';
  const loc = locale as Locale;

  const pillarResult = await db
    .select()
    .from(pillars)
    .where(and(eq(pillars.slug, slug), eq(pillars.isActive, true)))
    .limit(1);

  if (pillarResult.length === 0) notFound();

  const pillar = pillarResult[0];
  const name = localized(loc, pillar.nameEn, pillar.nameAr);
  const description = localized(loc, pillar.descriptionEn, pillar.descriptionAr);
  const Icon = pillar.iconKey
    ? ((Icons as any)[pillar.iconKey] as
        | React.ComponentType<{ size?: number; className?: string }>
        | undefined)
    : undefined;

  // Pull published places under this pillar.
  const pillarPlaces = await db
    .select()
    .from(places)
    .where(and(eq(places.pillarId, pillar.id), eq(places.status, 'published')))
    .orderBy(desc(places.isFeatured), asc(places.nameEn))
    .limit(48);

  return (
    <div className="min-h-screen">
      {/* Hero with cover */}
      <section className="relative">
        <div className="relative h-[400px] w-full overflow-hidden sm:h-[500px]">
          {pillar.coverImageUrl ? (
            <img
              src={pillar.coverImageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-gold/30 via-amber/15 to-bg" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-bg/40 to-bg" />
        </div>

        <div className="absolute inset-0 flex items-end px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <FadeIn>
              <Link
                href={`/${locale}/pillars`}
                className="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-gold"
              >
                <ArrowLeft size={16} className={isAr ? 'rotate-180' : ''} />
                {isAr ? 'كل المحاور' : 'All Pillars'}
              </Link>

              <div className="mb-4 flex items-center gap-4">
                {Icon && (
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold/15 ring-1 ring-gold/30 backdrop-blur-sm">
                    <Icon size={28} className="text-gold" />
                  </div>
                )}
                <h1 className="text-5xl font-bold text-text-primary lg:text-6xl" lang={locale}>
                  {name}
                </h1>
              </div>

              {description && (
                <p
                  className="max-w-3xl text-xl leading-relaxed text-text-secondary"
                  lang={locale}
                >
                  {description}
                </p>
              )}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Places grid */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {pillarPlaces.length > 0 ? (
            <>
              <FadeIn>
                <div className="mb-10 flex items-baseline justify-between">
                  <h2 className="text-3xl font-bold text-text-primary">
                    {isAr ? `أماكن في ${name}` : `Places in ${name}`}
                  </h2>
                  <p className="text-sm text-text-secondary">
                    {pillarPlaces.length}{' '}
                    {isAr
                      ? pillarPlaces.length === 1
                        ? 'مكان'
                        : 'مكان'
                      : pillarPlaces.length === 1
                      ? 'place'
                      : 'places'}
                  </p>
                </div>
              </FadeIn>

              <StaggerChildren className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pillarPlaces.map((p) => {
                  const placeName = localized(loc, p.nameEn, p.nameAr);
                  const tagline = localized(loc, p.taglineEn, p.taglineAr);
                  const location = localized(loc, p.locationEn, p.locationAr);
                  return (
                    <div key={p.id} data-stagger>
                      <Link
                        href={`/${locale}/pillars/${pillar.slug}/${p.slug}` as any}
                        className="group relative block overflow-hidden rounded-2xl border border-border bg-surface-elevated transition-all duration-500 hover:border-gold/40 hover:shadow-[0_0_30px_rgba(212,168,83,0.15)] hover:-translate-y-1"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gold/10 to-amber/5">
                          {p.coverImageUrl ? (
                            <img
                              src={p.coverImageUrl}
                              alt={placeName}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <span className="text-3xl font-bold text-gold/30">
                                {placeName.charAt(0)}
                              </span>
                            </div>
                          )}
                          {p.isFeatured && (
                            <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-gold text-bg text-[10px] font-bold uppercase tracking-wider">
                              {isAr ? 'مميز' : 'Featured'}
                            </div>
                          )}
                          <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-bg/70 backdrop-blur-sm text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                            {p.type}
                          </div>
                        </div>

                        <div className="relative p-5">
                          <h3
                            className="text-lg font-bold text-text-primary transition-colors group-hover:text-gold mb-1"
                            lang={locale}
                          >
                            {placeName}
                          </h3>
                          {tagline && (
                            <p
                              className="text-sm text-text-secondary line-clamp-2 mb-3"
                              lang={locale}
                            >
                              {tagline}
                            </p>
                          )}
                          {location && (
                            <div className="flex items-center gap-1.5 text-xs text-text-secondary/70">
                              <MapPin size={12} />
                              <span lang={locale}>{location}</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </StaggerChildren>
            </>
          ) : (
            <div className="rounded-2xl border border-border bg-surface-elevated p-12 text-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gold">
                {isAr ? 'قريباً' : 'Coming soon'}
              </p>
              <h3 className="mb-3 text-2xl font-bold text-text-primary">
                {isAr ? 'لا توجد أماكن منشورة بعد' : 'No published places yet'}
              </h3>
              <p className="mx-auto max-w-xl text-text-secondary">
                {isAr
                  ? `سنضيف أماكن وتجارب مرتبطة بـ "${name}" قريباً.`
                  : `Places and experiences for "${name}" are being curated. Check back soon.`}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
