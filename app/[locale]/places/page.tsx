import Link from 'next/link';
import { MapPin } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren from '@/components/animations/StaggerChildren';
import { db } from '@/src/infrastructure/db/client';
import { places, pillars } from '@/src/infrastructure/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { localized, type Locale } from '@/src/lib/locale';

interface PlacesPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ pillar?: string; type?: string }>;
}

export default async function PlacesPage({ params, searchParams }: PlacesPageProps) {
  const { locale } = await params;
  const filters = await searchParams;
  const isAr = locale === 'ar';
  const loc = locale as Locale;

  // Build the WHERE clause from filters
  const conditions = [eq(places.status, 'published')];
  if (filters.pillar) {
    // Look up pillar by slug, then filter by id.
    const pr = await db.select().from(pillars).where(eq(pillars.slug, filters.pillar)).limit(1);
    if (pr.length > 0) conditions.push(eq(places.pillarId, pr[0].id));
  }
  if (filters.type) conditions.push(eq(places.type, filters.type));

  // Fetch with pillar slug joined for URL building.
  const data = await db
    .select({
      id: places.id,
      slug: places.slug,
      pillarId: places.pillarId,
      pillarSlug: pillars.slug,
      type: places.type,
      nameEn: places.nameEn,
      nameAr: places.nameAr,
      taglineEn: places.taglineEn,
      taglineAr: places.taglineAr,
      locationEn: places.locationEn,
      locationAr: places.locationAr,
      coverImageUrl: places.coverImageUrl,
      isFeatured: places.isFeatured,
    })
    .from(places)
    .innerJoin(pillars, eq(places.pillarId, pillars.id))
    .where(and(...conditions))
    .orderBy(desc(places.isFeatured), desc(places.createdAt))
    .limit(60);

  // For the filter chips: list of active pillars
  const allPillars = await db
    .select({ slug: pillars.slug, nameEn: pillars.nameEn, nameAr: pillars.nameAr })
    .from(pillars)
    .where(eq(pillars.isActive, true))
    .orderBy(pillars.displayOrder);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative border-b border-border/30 bg-gradient-to-b from-surface-elevated via-surface-elevated/50 to-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-40" />
        <div className="relative mx-auto max-w-7xl">
          <FadeIn>
            <div className="mb-6 inline-block rounded-full border border-gold/30 bg-gold/5 px-4 py-2">
              <p className="text-sm font-semibold text-gold">
                {isAr ? 'أماكن' : 'Places'}
              </p>
            </div>
            <h1 className="mb-4 text-5xl font-bold text-text-primary lg:text-6xl">
              {isAr ? 'كل' : 'Every'}{' '}
              <span className="gradient-text">{isAr ? 'الأماكن' : 'Place'}</span>
            </h1>
            <p className="max-w-2xl text-xl text-text-secondary leading-relaxed" lang={locale}>
              {isAr
                ? 'مطاعم، متاحف، معالم، ومقاهي. كل مكان قابل للاكتشاف في القاهرة في مكان واحد.'
                : 'Restaurants, museums, landmarks, cafés. Every discoverable spot in Cairo in one place.'}
            </p>
          </FadeIn>

          {/* Pillar filter chips */}
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              href={`/${locale}/places`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                !filters.pillar
                  ? 'bg-gold text-bg'
                  : 'bg-surface-elevated text-text-secondary hover:text-gold border border-border'
              }`}
            >
              {isAr ? 'الكل' : 'All'}
            </Link>
            {allPillars.map((p) => {
              const name = localized(loc, p.nameEn, p.nameAr);
              return (
                <Link
                  key={p.slug}
                  href={`/${locale}/places?pillar=${p.slug}` as any}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    filters.pillar === p.slug
                      ? 'bg-gold text-bg'
                      : 'bg-surface-elevated text-text-secondary hover:text-gold border border-border'
                  }`}
                  lang={locale}
                >
                  {name}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {data.length > 0 ? (
            <StaggerChildren className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.map((p) => {
                const placeName = localized(loc, p.nameEn, p.nameAr);
                const tagline = localized(loc, p.taglineEn, p.taglineAr);
                const location = localized(loc, p.locationEn, p.locationAr);
                return (
                  <div key={p.id} data-stagger>
                    <Link
                      href={`/${locale}/pillars/${p.pillarSlug}/${p.slug}` as any}
                      className="group relative block overflow-hidden rounded-xl border border-border bg-surface-elevated transition-all duration-500 hover:border-gold/40 hover:-translate-y-1"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gold/10 to-amber/5">
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
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-bg/70 backdrop-blur-sm text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                          {p.type}
                        </div>
                      </div>
                      <div className="p-4">
                        <h2 className="text-base font-bold text-text-primary group-hover:text-gold transition-colors line-clamp-1 mb-1" lang={locale}>
                          {placeName}
                        </h2>
                        {tagline && (
                          <p className="text-xs text-text-secondary line-clamp-2 mb-2" lang={locale}>
                            {tagline}
                          </p>
                        )}
                        {location && (
                          <div className="flex items-center gap-1 text-xs text-text-secondary/70">
                            <MapPin size={10} />
                            <span lang={locale} className="line-clamp-1">{location}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </StaggerChildren>
          ) : (
            <div className="py-20 text-center">
              <p className="text-text-secondary">
                {isAr ? 'لا توجد أماكن مطابقة' : 'No places match'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
