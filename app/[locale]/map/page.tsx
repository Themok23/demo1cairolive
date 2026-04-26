import dynamic from 'next/dynamic';
import { db } from '@/src/infrastructure/db/client';
import { places, pillars } from '@/src/infrastructure/db/schema';
import { and, eq, isNotNull } from 'drizzle-orm';
import FadeIn from '@/components/animations/FadeIn';

// Map color per pillar slug — keep in sync with the colors used elsewhere
const PILLAR_COLORS: Record<string, string> = {
  tourism:       '#D4A853', // gold
  restaurants:   '#F87171', // rose
  heritage:      '#A78BFA', // violet
  'arts-culture':'#60A5FA', // sky
  tech:          '#4ADE80', // emerald
};
const DEFAULT_COLOR = '#D4A853';

// Leaflet needs window — disable SSR for the map component.
const PlacesMap = dynamic(() => import('@/components/client/PlacesMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-surface-elevated rounded-xl text-text-secondary">
      Loading map...
    </div>
  ),
});

interface MapPageProps {
  params: Promise<{ locale: string }>;
}

export default async function MapPage({ params }: MapPageProps) {
  const { locale } = await params;
  const isAr = locale === 'ar';

  // Pull every published place that has GPS coordinates, plus its pillar slug.
  const rows = await db
    .select({
      id: places.id,
      slug: places.slug,
      pillarSlug: pillars.slug,
      type: places.type,
      nameEn: places.nameEn,
      nameAr: places.nameAr,
      taglineEn: places.taglineEn,
      taglineAr: places.taglineAr,
      coverImageUrl: places.coverImageUrl,
      latitude: places.latitude,
      longitude: places.longitude,
    })
    .from(places)
    .innerJoin(pillars, eq(places.pillarId, pillars.id))
    .where(
      and(
        eq(places.status, 'published'),
        isNotNull(places.latitude),
        isNotNull(places.longitude)
      )
    );

  const pins = rows
    .filter((r) => r.latitude !== null && r.longitude !== null)
    .map((r) => ({
      id: r.id,
      slug: r.slug,
      pillarSlug: r.pillarSlug,
      pillarColor: PILLAR_COLORS[r.pillarSlug] ?? DEFAULT_COLOR,
      type: r.type,
      nameEn: r.nameEn,
      nameAr: r.nameAr,
      taglineEn: r.taglineEn,
      taglineAr: r.taglineAr,
      coverImageUrl: r.coverImageUrl,
      latitude: Number(r.latitude),
      longitude: Number(r.longitude),
    }));

  // Distinct pillars present, for the legend.
  const presentPillars = Array.from(new Set(pins.map((p) => p.pillarSlug)));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative border-b border-border/30 bg-gradient-to-b from-surface-elevated via-surface-elevated/50 to-surface px-4 py-12 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-40" />
        <div className="relative mx-auto max-w-7xl">
          <FadeIn>
            <div className="mb-4 inline-block rounded-full border border-gold/30 bg-gold/5 px-4 py-2">
              <p className="text-sm font-semibold text-gold">
                {isAr ? 'خريطة' : 'Map'}
              </p>
            </div>
            <h1 className="mb-3 text-4xl font-bold text-text-primary lg:text-5xl">
              {isAr ? 'كل أماكن' : 'Every place in'}{' '}
              <span className="gradient-text">{isAr ? 'القاهرة' : 'Cairo'}</span>
            </h1>
            <p className="max-w-2xl text-lg text-text-secondary leading-relaxed" lang={locale}>
              {isAr
                ? `${pins.length} مكان موزّعة على المحاور — اضغط على أي علامة لتعرف المزيد.`
                : `${pins.length} places across all pillars. Click any pin for the details.`}
            </p>
          </FadeIn>

          {/* Legend */}
          {presentPillars.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
              <span className="text-xs uppercase tracking-wider text-text-secondary/60">
                {isAr ? 'الألوان حسب المحور' : 'Pin colors by pillar'}
              </span>
              {presentPillars.map((slug) => (
                <div key={slug} className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: PILLAR_COLORS[slug] ?? DEFAULT_COLOR }}
                  />
                  <span className="capitalize text-text-secondary">
                    {slug.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Map (full-width) */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-[70vh] min-h-[500px] w-full rounded-xl overflow-hidden border border-border bg-surface-elevated">
            {pins.length > 0 ? (
              <PlacesMap places={pins} locale={locale} />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-text-secondary">
                {isAr ? 'لا توجد أماكن للعرض' : 'No places with coordinates yet'}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
