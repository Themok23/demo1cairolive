import Link from 'next/link';
import Button, { ButtonLink } from '@/components/ui/Button';
import FadeIn from '@/components/animations/FadeIn';
import { db } from '@/src/infrastructure/db/client';
import { articles, persons } from '@/src/infrastructure/db/schema';
import { eq, desc, and, ne } from 'drizzle-orm';
import { ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { sanitizeContent } from '@/lib/sanitize';
import { localized, type Locale } from '@/src/lib/locale';

interface ArticlePageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  try {
    const { locale, slug } = await params;
    const loc = locale as Locale;
    const article = await db
      .select()
      .from(articles)
      .where(eq(articles.slugEn, slug))
      .limit(1);

    if (article.length === 0) {
      return {};
    }

    const currentArticle = article[0];
    const title       = localized(loc, currentArticle.titleEn, currentArticle.titleAr);
    const description = localized(loc, currentArticle.excerptEn, currentArticle.excerptAr);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: currentArticle.publishedAt?.toISOString(),
        images: currentArticle.featuredImageUrl ? [{ url: currentArticle.featuredImageUrl, alt: title }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: currentArticle.featuredImageUrl ? [currentArticle.featuredImageUrl] : undefined,
      },
    };
  } catch (error) {
    console.error('Error generating article metadata:', error);
    return {};
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const article = await db
    .select()
    .from(articles)
    .where(eq(articles.slugEn, slug))
    .limit(1);

  if (article.length === 0) {
    notFound();
  }

  const currentArticle = article[0];

  const [malePersonResult, femalePersonResult] = await Promise.all([
    currentArticle.malePersonId
      ? db.select().from(persons).where(eq(persons.id, currentArticle.malePersonId)).limit(1)
      : Promise.resolve([]),
    currentArticle.femalePersonId
      ? db.select().from(persons).where(eq(persons.id, currentArticle.femalePersonId)).limit(1)
      : Promise.resolve([]),
  ]);

  const malePerson = malePersonResult[0] || null;
  const femalePerson = femalePersonResult[0] || null;

  // Fetch related articles: same category first, excluding current article
  const relatedArticles = await (async () => {
    // Try same category first
    if (currentArticle.category) {
      const sameCat = await db
        .select()
        .from(articles)
        .where(
          and(
            eq(articles.status, 'published'),
            eq(articles.category, currentArticle.category),
            ne(articles.id, currentArticle.id)
          )
        )
        .orderBy(desc(articles.publishedAt))
        .limit(3);
      if (sameCat.length >= 3) return sameCat;

      // Pad with latest published if not enough same-category results
      const sameCatIds = sameCat.map((a) => a.id);
      const padded = await db
        .select()
        .from(articles)
        .where(
          and(
            eq(articles.status, 'published'),
            ne(articles.id, currentArticle.id),
            ne(articles.category, currentArticle.category)
          )
        )
        .orderBy(desc(articles.publishedAt))
        .limit(3 - sameCat.length);
      return [...sameCat, ...padded].slice(0, 3);
    }

    // No category — fall back to latest published
    return db
      .select()
      .from(articles)
      .where(
        and(
          eq(articles.status, 'published'),
          ne(articles.id, currentArticle.id)
        )
      )
      .orderBy(desc(articles.publishedAt))
      .limit(3);
  })();

  const isAr = locale === 'ar';
  const articleTitle   = localized(loc, currentArticle.titleEn, currentArticle.titleAr);
  const articleExcerpt = localized(loc, currentArticle.excerptEn, currentArticle.excerptAr);
  const articleContent = localized(loc, currentArticle.contentEn, currentArticle.contentAr);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <FadeIn className="mb-8">
            <ButtonLink href={`/${locale}/articles`} variant="ghost" size="sm">
              {isAr ? '← العودة للمقالات' : '← Back to Articles'}
            </ButtonLink>
          </FadeIn>

          <FadeIn className="mb-8">
            {currentArticle.category && (
              <span className="inline-block rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold border border-gold/30 mb-4">
                {currentArticle.category}
              </span>
            )}
            <h1 className="mb-6 text-5xl font-black text-text-primary lg:text-6xl leading-tight" lang={locale}>
              {articleTitle}
            </h1>
            <p className="mb-6 text-xl text-text-secondary leading-relaxed" lang={locale}>
              {articleExcerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-text-secondary">
              {currentArticle.publishedAt && (
                <>
                  <span>
                    {new Date(currentArticle.publishedAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span>•</span>
                </>
              )}
              {currentArticle.readTimeMinutes && (
                <span>
                  {currentArticle.readTimeMinutes} {isAr ? 'دقيقة' : 'min'} {isAr ? '' : 'read'}
                </span>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Featured Image */}
      {currentArticle.featuredImageUrl && (
        <FadeIn className="px-4 sm:px-6 lg:px-8 mb-12">
          <div className="mx-auto max-w-3xl">
            <div className="relative h-96 w-full overflow-hidden rounded-xl border border-border/30">
              <img
                src={currentArticle.featuredImageUrl}
                alt={articleTitle}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </FadeIn>
      )}

      {/* Article Content */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            {articleContent && (
              <div
                lang={locale}
                className="prose prose-invert max-w-none text-text-primary"
                dangerouslySetInnerHTML={{ __html: sanitizeContent(articleContent) }}
              />
            )}
          </FadeIn>
        </div>
      </section>

      {/* Featured Persons Section */}
      {(malePerson || femalePerson) && (
        <section className="relative px-4 py-16 sm:px-6 lg:px-8 border-t border-border/30">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/3 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-7xl">
            <FadeIn className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-text-primary lg:text-4xl">
                {isAr ? 'الملامح المميزة' : 'Featured Profiles'}
              </h2>
            </FadeIn>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {malePerson && (
                <FadeIn>
                  <Link href={`/${locale}/krtk/${malePerson.id}`}>
                    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-surface-elevated to-surface p-6 transition-all duration-300 hover:border-gold/60 hover:shadow-[0_0_30px_rgba(212,168,83,0.2)] hover:-translate-y-2 cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {malePerson.profileImageUrl && (
                        <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
                          <img
                            src={malePerson.profileImageUrl}
                            alt={`${localized(loc, malePerson.firstNameEn, malePerson.firstNameAr)} ${localized(loc, malePerson.lastNameEn, malePerson.lastNameAr)}`}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className="relative z-10">
                        <h3 className="mb-1 text-2xl font-bold text-text-primary group-hover:text-gold transition-colors duration-200" lang={locale}>
                          {localized(loc, malePerson.firstNameEn, malePerson.firstNameAr)} {localized(loc, malePerson.lastNameEn, malePerson.lastNameAr)}
                        </h3>
                        {(malePerson.currentPositionEn || malePerson.currentPositionAr) && (
                          <p className="mb-2 text-sm font-semibold text-gold/90" lang={locale}>
                            {localized(loc, malePerson.currentPositionEn, malePerson.currentPositionAr)}
                          </p>
                        )}
                        {(malePerson.currentCompanyEn || malePerson.currentCompanyAr) && (
                          <p className="mb-4 text-sm text-text-secondary" lang={locale}>
                            {localized(loc, malePerson.currentCompanyEn, malePerson.currentCompanyAr)}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-gold">
                          <span className="text-sm font-semibold">{isAr ? 'عرض الملف' : 'View Profile'}</span>
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              )}

              {femalePerson && (
                <FadeIn>
                  <Link href={`/${locale}/krtk/${femalePerson.id}`}>
                    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-surface-elevated to-surface p-6 transition-all duration-300 hover:border-gold/60 hover:shadow-[0_0_30px_rgba(212,168,83,0.2)] hover:-translate-y-2 cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {femalePerson.profileImageUrl && (
                        <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
                          <img
                            src={femalePerson.profileImageUrl}
                            alt={`${localized(loc, femalePerson.firstNameEn, femalePerson.firstNameAr)} ${localized(loc, femalePerson.lastNameEn, femalePerson.lastNameAr)}`}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className="relative z-10">
                        <h3 className="mb-1 text-2xl font-bold text-text-primary group-hover:text-gold transition-colors duration-200" lang={locale}>
                          {localized(loc, femalePerson.firstNameEn, femalePerson.firstNameAr)} {localized(loc, femalePerson.lastNameEn, femalePerson.lastNameAr)}
                        </h3>
                        {(femalePerson.currentPositionEn || femalePerson.currentPositionAr) && (
                          <p className="mb-2 text-sm font-semibold text-gold/90" lang={locale}>
                            {localized(loc, femalePerson.currentPositionEn, femalePerson.currentPositionAr)}
                          </p>
                        )}
                        {(femalePerson.currentCompanyEn || femalePerson.currentCompanyAr) && (
                          <p className="mb-4 text-sm text-text-secondary" lang={locale}>
                            {localized(loc, femalePerson.currentCompanyEn, femalePerson.currentCompanyAr)}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-gold">
                          <span className="text-sm font-semibold">{isAr ? 'عرض الملف' : 'View Profile'}</span>
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="relative px-4 py-16 sm:px-6 lg:px-8 border-t border-border/30">
          <div className="mx-auto max-w-7xl">
            <FadeIn className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-text-primary lg:text-4xl">
                {isAr ? 'مقالات ذات صلة' : 'Related Articles'}
              </h2>
            </FadeIn>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {relatedArticles.map((article) => (
                <FadeIn key={article.id}>
                  <Link href={`/${locale}/articles/${article.slugEn}`}>
                    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-surface-elevated to-surface transition-all duration-300 hover:border-gold/60 hover:shadow-[0_0_30px_rgba(212,168,83,0.2)] hover:-translate-y-2 cursor-pointer h-full flex flex-col">
                      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {article.featuredImageUrl && (
                        <div className="relative h-40 w-full overflow-hidden">
                          <img
                            src={article.featuredImageUrl}
                            alt={localized(loc, article.titleEn, article.titleAr)}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className="relative z-10 flex flex-1 flex-col justify-between p-4">
                        <div>
                          {article.category && (
                            <span className="mb-2 inline-block rounded-full bg-gold/10 px-2 py-0.5 text-xs font-semibold text-gold border border-gold/30">
                              {article.category}
                            </span>
                          )}
                          <h3 className="mb-2 text-lg font-bold text-text-primary group-hover:text-gold transition-colors duration-200 line-clamp-2" lang={locale}>
                            {localized(loc, article.titleEn, article.titleAr)}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border/30 text-xs text-text-secondary">
                          {article.publishedAt && (
                            <span>
                              {new Date(article.publishedAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          )}
                          <ArrowRight size={14} className="text-gold" />
                        </div>

                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8 border-t border-border/30">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/3 via-transparent to-gold/3" />
        <div className="relative mx-auto max-w-4xl text-center">
          <FadeIn>
            <h2 className="mb-4 text-3xl font-bold text-text-primary lg:text-4xl">
              {isAr ? 'هل أنت ملحوظ؟' : 'Are You Remarkable?'}
            </h2>
            <p className="mb-8 text-lg text-text-secondary">
              {isAr
                ? 'شارك قصتك وملفك الشخصي مع مجتمعنا المتنامي'
                : 'Share your story and profile with our growing community'}
            </p>
            <ButtonLink href={`/${locale}/submit`} size="lg" className="gap-2">
              {isAr ? 'أرسل ملفك' : 'Submit Your Profile'}
              <ArrowRight size={18} />
            </ButtonLink>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
