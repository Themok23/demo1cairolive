import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Clock,
} from 'lucide-react';
import { notFound } from 'next/navigation';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren from '@/components/animations/StaggerChildren';
import WhatsAppShareButton from '@/components/ui/WhatsAppShareButton';
import { db } from '@/src/infrastructure/db/client';
import { pillars, places, placePersons, persons } from '@/src/infrastructure/db/schema';
import { and, asc, desc, eq, ne } from 'drizzle-orm';
import { localized, type Locale } from '@/src/lib/locale';

interface PlacePageProps {
  params: Promise<{ locale: string; slug: string; placeSlug: string }>;
}

interface OpeningHourEntry {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

function safeParseHours(json?: string | null): OpeningHourEntry[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeParseGallery(json?: string | null): string[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { locale, slug, placeSlug } = await params;
  const isAr = locale === 'ar';
  const loc = locale as Locale;

  // Pillar lookup (must be active)
  const pillarResult = await db
    .select()
    .from(pillars)
    .where(and(eq(pillars.slug, slug), eq(pillars.isActive, true)))
    .limit(1);
  if (pillarResult.length === 0) notFound();
  const pillar = pillarResult[0];

  // Place lookup (must belong to this pillar AND be published)
  const placeResult = await db
    .select()
    .from(places)
    .where(
      and(
        eq(places.slug, placeSlug),
        eq(places.pillarId, pillar.id),
        eq(places.status, 'published')
      )
    )
    .limit(1);
  if (placeResult.length === 0) notFound();
  const place = placeResult[0];

  // Connected people via place_persons
  const associatedPersons = await db
    .select({
      placeId: placePersons.placeId,
      personId: placePersons.personId,
      role: placePersons.role,
      roleEn: placePersons.roleEn,
      roleAr: placePersons.roleAr,
      displayOrder: placePersons.displayOrder,
      firstNameEn: persons.firstNameEn,
      firstNameAr: persons.firstNameAr,
      lastNameEn: persons.lastNameEn,
      lastNameAr: persons.lastNameAr,
      profileImageUrl: persons.profileImageUrl,
      tier: persons.tier,
    })
    .from(placePersons)
    .innerJoin(persons, eq(placePersons.personId, persons.id))
    .where(eq(placePersons.placeId, place.id))
    .orderBy(asc(placePersons.displayOrder));

  // Related places (same pillar, exclude current)
  const relatedPlaces = await db
    .select()
    .from(places)
    .where(
      and(
        eq(places.pillarId, pillar.id),
        eq(places.status, 'published'),
        ne(places.id, place.id)
      )
    )
    .orderBy(desc(places.isFeatured), desc(places.createdAt))
    .limit(4);

  const placeName = localized(loc, place.nameEn, place.nameAr);
  const placeTagline = localized(loc, place.taglineEn, place.taglineAr);
  const placeDescription = localized(loc, place.descriptionEn, place.descriptionAr);
  const placeLocation = localized(loc, place.locationEn, place.locationAr);
  const pillarName = localized(loc, pillar.nameEn, pillar.nameAr);
  const gallery = safeParseGallery(place.galleryImagesJson);
  const hours = safeParseHours(place.openingHoursJson);

  return (
    <div className="min-h-screen">
      {/* Hero with cover */}
      <section className="relative">
        <div className="relative h-[500px] w-full overflow-hidden sm:h-[600px]">
          {place.coverImageUrl ? (
            <img
              src={place.coverImageUrl}
              alt={placeName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-gold/30 via-amber/15 to-bg" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/30 to-bg" />
        </div>

        <div className="absolute inset-0 flex items-end px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <FadeIn>
              {/* Breadcrumb */}
              <div className="mb-6 flex items-center gap-2 text-sm text-text-secondary">
                <Link
                  href={`/${locale}/pillars`}
                  className="transition-colors hover:text-gold"
                >
                  {isAr ? 'المحاور' : 'Pillars'}
                </Link>
                <span>/</span>
                <Link
                  href={`/${locale}/pillars/${pillar.slug}`}
                  className="transition-colors hover:text-gold"
                  lang={locale}
                >
                  {pillarName}
                </Link>
                <span>/</span>
                <span className="text-text-primary" lang={locale}>{placeName}</span>
              </div>

              <div className="mb-4 inline-block px-3 py-1 rounded-md bg-gold/15 text-gold text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                {place.type}
              </div>

              <h1 className="mb-4 text-5xl font-bold text-text-primary lg:text-6xl" lang={locale}>
                {placeName}
              </h1>

              {placeTagline && (
                <p className="max-w-3xl text-xl leading-relaxed text-text-secondary mb-4" lang={locale}>
                  {placeTagline}
                </p>
              )}

              {placeLocation && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin size={16} className="text-gold" />
                  <span lang={locale}>{placeLocation}</span>
                </div>
              )}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Body grid: description / practical info */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-3 gap-10">
          {/* LEFT: description + gallery + people */}
          <div className="lg:col-span-2 space-y-12">
            {placeDescription && (
              <FadeIn>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-4">
                    {isAr ? 'نظرة عامة' : 'About'}
                  </h2>
                  <p className="text-text-secondary leading-relaxed text-lg whitespace-pre-line" lang={locale}>
                    {placeDescription}
                  </p>
                </div>
              </FadeIn>
            )}

            {gallery.length > 0 && (
              <FadeIn>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-4">
                    {isAr ? 'معرض الصور' : 'Gallery'}
                  </h2>
                  <StaggerChildren className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {gallery.map((src, i) => (
                      <div key={i} data-stagger className="aspect-square overflow-hidden rounded-lg border border-border">
                        <img
                          src={src}
                          alt={`${placeName} — ${i + 1}`}
                          className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </StaggerChildren>
                </div>
              </FadeIn>
            )}

            {associatedPersons.length > 0 && (
              <FadeIn>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-4">
                    {isAr ? 'الفريق' : 'The team'}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {associatedPersons.map((p) => {
                      const personName = isAr && p.firstNameAr
                        ? `${p.firstNameAr} ${p.lastNameAr ?? ''}`.trim()
                        : `${p.firstNameEn} ${p.lastNameEn}`.trim();
                      const role = localized(loc, p.roleEn, p.roleAr) ?? p.role;
                      return (
                        <Link
                          key={`${p.placeId}-${p.personId}-${p.role}`}
                          href={`/${locale}/krtk/${p.personId}` as any}
                          className="group flex items-center gap-3 p-3 rounded-lg border border-border bg-surface-elevated hover:border-gold/30 hover:bg-gold/5 transition-all"
                        >
                          {p.profileImageUrl ? (
                            <img
                              src={p.profileImageUrl}
                              alt={personName}
                              className="w-12 h-12 rounded-lg object-cover ring-1 ring-gold/20"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center ring-1 ring-gold/20">
                              <span className="text-sm font-bold text-gold">
                                {personName.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-text-primary group-hover:text-gold transition-colors truncate" lang={locale}>
                              {personName}
                            </p>
                            <p className="text-sm text-text-secondary truncate" lang={locale}>
                              {role}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </FadeIn>
            )}
          </div>

          {/* RIGHT: practical info card */}
          <aside>
            <FadeIn>
              <div className="sticky top-24 rounded-2xl border border-border bg-surface-elevated p-6 space-y-5">
                <h3 className="text-lg font-bold text-text-primary">
                  {isAr ? 'معلومات' : 'Practical info'}
                </h3>

                {hours.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-text-primary">
                      <Clock size={14} className="text-gold" />
                      {isAr ? 'ساعات العمل' : 'Hours'}
                    </div>
                    <ul className="space-y-1 text-sm text-text-secondary">
                      {hours.map((h, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{h.day}</span>
                          <span>
                            {h.closed ? (isAr ? 'مغلق' : 'Closed') : `${h.open} – ${h.close}`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2">
                  {place.phone && (
                    <a
                      href={`tel:${place.phone}`}
                      className="flex items-center gap-3 text-sm text-text-secondary hover:text-gold transition-colors"
                      dir="ltr"
                    >
                      <Phone size={14} className="flex-shrink-0" />
                      <span>{place.phone}</span>
                    </a>
                  )}
                  {place.email && (
                    <a
                      href={`mailto:${place.email}`}
                      className="flex items-center gap-3 text-sm text-text-secondary hover:text-gold transition-colors"
                    >
                      <Mail size={14} className="flex-shrink-0" />
                      <span className="truncate">{place.email}</span>
                    </a>
                  )}
                  {place.websiteUrl && (
                    <a
                      href={place.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-text-secondary hover:text-gold transition-colors"
                    >
                      <Globe size={14} className="flex-shrink-0" />
                      <span className="truncate">{isAr ? 'الموقع الإلكتروني' : 'Website'}</span>
                    </a>
                  )}
                  {place.instagramUrl && (
                    <a
                      href={place.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-text-secondary hover:text-gold transition-colors"
                    >
                      <Instagram size={14} className="flex-shrink-0" />
                      <span>Instagram</span>
                    </a>
                  )}
                </div>

                {place.mapUrl && (
                  <a
                    href={place.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-4 py-2 rounded-lg bg-gold/10 border border-gold/30 text-gold font-semibold text-sm hover:bg-gold/15 transition-colors"
                  >
                    {isAr ? 'افتح في الخريطة' : 'Open in Maps'}
                  </a>
                )}

                <div className="pt-3 border-t border-border/50">
                  <WhatsAppShareButton
                    variant="pill"
                    url={`/${locale}/pillars/${pillar.slug}/${place.slug}`}
                    text={
                      isAr
                        ? `${placeName} — ${placeTagline ?? pillarName}`
                        : `${placeName} — ${placeTagline ?? pillarName}`
                    }
                    locale={locale}
                    className="w-full justify-center"
                  />
                </div>
              </div>
            </FadeIn>
          </aside>
        </div>
      </section>

      {/* Related places */}
      {relatedPlaces.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-8 border-t border-border/30">
          <div className="mx-auto max-w-7xl">
            <FadeIn>
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-primary">
                  {isAr ? `المزيد من ${pillarName}` : `More in ${pillarName}`}
                </h2>
                <Link
                  href={`/${locale}/pillars/${pillar.slug}`}
                  className="text-sm font-semibold text-gold hover:text-gold/80 transition-colors"
                >
                  {isAr ? 'الكل' : 'View all'}
                </Link>
              </div>
            </FadeIn>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedPlaces.map((rp) => {
                const rpName = localized(loc, rp.nameEn, rp.nameAr);
                return (
                  <Link
                    key={rp.id}
                    href={`/${locale}/pillars/${pillar.slug}/${rp.slug}` as any}
                    className="group relative block overflow-hidden rounded-xl border border-border bg-surface-elevated transition-all hover:border-gold/40"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-gold/10 to-amber/5">
                      {rp.coverImageUrl ? (
                        <img
                          src={rp.coverImageUrl}
                          alt={rpName}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="text-2xl font-bold text-gold/30">
                            {rpName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-text-primary group-hover:text-gold transition-colors line-clamp-1" lang={locale}>
                        {rpName}
                      </h3>
                      <p className="text-xs text-text-secondary uppercase tracking-wider mt-1">
                        {rp.type}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
