import Link from 'next/link';
import FadeIn from '@/components/animations/FadeIn';
import TierBadge from '@/components/ui/TierBadge';
import { db } from '@/src/infrastructure/db/client';
import { persons, articles } from '@/src/infrastructure/db/schema';
import { eq, desc, or } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { localized, type Locale } from '@/src/lib/locale';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

interface ProfilePageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { locale, id } = await params;
  const person = await db.select().from(persons).where(eq(persons.id, id)).limit(1);
  if (person.length === 0) return {};

  const p = person[0];
  const loc = locale as Locale;
  const firstName = localized(loc, p.firstNameEn, p.firstNameAr) ?? '';
  const lastName  = localized(loc, p.lastNameEn, p.lastNameAr) ?? '';
  const fullName  = `${firstName} ${lastName}`.trim();
  const bio       = localized(loc, p.bioEn, p.bioAr) ?? '';
  const position  = localized(loc, p.currentPositionEn, p.currentPositionAr);
  const description = position ? `${position} — ${bio.slice(0, 120)}` : bio.slice(0, 160);

  return {
    title: fullName,
    description: description.trim() || undefined,
    openGraph: {
      title: fullName,
      description: description.trim() || undefined,
      images: p.profileImageUrl ? [{ url: p.profileImageUrl, alt: fullName }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullName,
      description: description.trim() || undefined,
      images: p.profileImageUrl ? [p.profileImageUrl] : [],
    },
  };
}

export default async function PersonProfilePage({ params }: ProfilePageProps) {
  const { locale, id } = await params;
  const person = await db
    .select()
    .from(persons)
    .where(eq(persons.id, id))
    .limit(1);

  if (person.length === 0) {
    notFound();
  }

  const p = person[0];
  const isAr = locale === 'ar';
  const loc = locale as Locale;

  const firstName   = localized(loc, p.firstNameEn, p.firstNameAr);
  const lastName    = localized(loc, p.lastNameEn, p.lastNameAr);
  const fullName    = `${firstName} ${lastName}`.trim();
  const bio         = localized(loc, p.bioEn, p.bioAr);
  const position    = localized(loc, p.currentPositionEn, p.currentPositionAr);
  const company     = localized(loc, p.currentCompanyEn, p.currentCompanyAr);
  const location    = localized(loc, p.locationEn, p.locationAr);

  const relatedArticles = await db
    .select()
    .from(articles)
    .where(
      or(
        eq(articles.malePersonId, p.id),
        eq(articles.femalePersonId, p.id)
      )
    )
    .orderBy(desc(articles.publishedAt))
    .limit(20);

  let keywords: string[] = [];
  try {
    keywords = JSON.parse(p.keywords || '[]');
    if (!Array.isArray(keywords)) keywords = [];
  } catch {
    keywords = [];
  }

  return (
    <div className="min-h-screen">
      {/* Cover */}
      <section className="relative h-64 sm:h-80 overflow-hidden">
        {p.coverImageUrl ? (
          <>
            <img src={p.coverImageUrl} alt={`Cover photo for ${fullName}`} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background" />
          </>
        ) : (
          <div className="h-full bg-gradient-to-br from-gold/10 via-surface to-background" />
        )}
        {/* Back link on cover */}
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <Link
            href={`/${locale}/people`}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm text-sm text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {isAr ? 'العودة' : 'Back'}
          </Link>
        </div>
      </section>

      {/* Profile header overlapping cover */}
      <section className="relative px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-background shadow-2xl ring-2 ring-gold/30">
                  {p.profileImageUrl ? (
                    <img src={p.profileImageUrl} alt={fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gold/20 to-surface flex items-center justify-center">
                      <span className="text-4xl font-bold text-gold/50">{firstName[0]}{lastName[0]}</span>
                    </div>
                  )}
                </div>
                {p.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1.5 border-4 border-background">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                )}
              </div>

              {/* Name + meta */}
              <div className="flex-1 pt-2 sm:pt-8">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight" lang={locale}>
                    {fullName}
                  </h1>
                  {p.tier && <TierBadge tier={p.tier} size="md" />}
                </div>

                {position && (
                  <p className="text-lg font-semibold text-gold mt-1" lang={locale}>{position}</p>
                )}
                {company && (
                  <p className="text-sm text-text-secondary mt-0.5" lang={locale}>{company}</p>
                )}

                {/* Quick contact row */}
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-text-secondary">
                  {location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gold/60" />
                      <span lang={locale}>{location}</span>
                    </span>
                  )}
                  {p.email && (
                    <a
                      href={`mailto:${p.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-gold transition-colors"
                      aria-label={isAr ? 'إرسال بريد إلكتروني' : 'Send email'}
                    >
                      <Mail className="w-3.5 h-3.5 text-gold/60" />
                      <span>{isAr ? 'تواصل عبر البريد' : 'Contact via Email'}</span>
                    </a>
                  )}
                  {p.phoneNumber && (
                    <a href={`tel:${p.phoneNumber}`} dir="ltr" className="inline-flex items-center gap-1.5 hover:text-gold transition-colors">
                      <Phone className="w-3.5 h-3.5 text-gold/60" />
                      {p.phoneNumber}
                    </a>
                  )}
                </div>

                {/* Keywords */}
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {keywords.map((kw, i) => (
                      <span key={i} className="inline-block rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold border border-gold/20">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}

                {/* Social links */}
                {(p.linkedinUrl || p.twitterUrl || p.instagramUrl || p.websiteUrl) && (
                  <div className="flex items-center gap-2 mt-4">
                    {p.linkedinUrl && (
                      <a href={p.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface-elevated text-text-secondary hover:bg-[#0077B5]/10 hover:text-[#0077B5] transition-all" aria-label="LinkedIn">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {p.twitterUrl && (
                      <a href={p.twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface-elevated text-text-secondary hover:bg-sky-500/10 hover:text-sky-400 transition-all" aria-label="Twitter">
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {p.instagramUrl && (
                      <a href={p.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface-elevated text-text-secondary hover:bg-pink-500/10 hover:text-pink-400 transition-all" aria-label="Instagram">
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {p.websiteUrl && (
                      <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface-elevated text-text-secondary hover:bg-gold/10 hover:text-gold transition-all" aria-label="Website">
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}

                {/* View Card button — always visible regardless of social links */}
                <div className="mt-4">
                  <Link
                    href={`/${locale}/krtk/${p.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gold/20 text-sm font-medium text-gold hover:bg-gold/5 transition-colors"
                  >
                    {isAr ? 'عرض البطاقة الرقمية' : 'View Digital Card'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Main column */}
            <div className="lg:col-span-2">
              {bio && (
                <FadeIn className="mb-12">
                  <h2 className="text-xl font-bold text-text-primary mb-4">
                    {isAr ? 'السيرة الذاتية' : 'Biography'}
                  </h2>
                  <p className="text-text-secondary leading-relaxed whitespace-pre-wrap" lang={locale}>
                    {bio}
                  </p>
                </FadeIn>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {relatedArticles.length > 0 && (
                <FadeIn>
                  <div className="sticky top-24 rounded-xl border border-border dark:border-border/50 bg-surface shadow-sm dark:shadow-none dark:bg-gradient-to-br dark:from-surface-elevated dark:to-surface p-6">
                    <h3 className="text-lg font-bold text-text-primary mb-4">
                      {isAr ? 'مقالات مميزة' : 'Featured Articles'}
                    </h3>
                    <div className="space-y-3">
                      {relatedArticles.map((article) => (
                        <Link key={article.id} href={`/${locale}/articles/${article.slugEn}`}>
                          <div className="group rounded-lg border border-border/50 dark:border-border/30 bg-surface p-4 hover:border-gold/40 transition-colors cursor-pointer">
                            <h4 className="font-semibold text-text-primary group-hover:text-gold transition-colors line-clamp-2 text-sm mb-2" lang={locale}>
                              {localized(loc, article.titleEn, article.titleAr)}
                            </h4>
                            <div className="flex items-center gap-1.5 text-xs text-gold">
                              <span>{isAr ? 'اقرأ المقال' : 'Read Article'}</span>
                              <ArrowRight size={12} />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
