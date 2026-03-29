import Link from 'next/link';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/animations/FadeIn';
import { db } from '@/src/infrastructure/db/client';
import { articles, persons } from '@/src/infrastructure/db/schema';
import { eq, desc } from 'drizzle-orm';
import { ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface ArticlePageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  try {
    const article = await db
      .select()
      .from(articles)
      .where(eq(articles.slug, params.slug))
      .limit(1);

    if (article.length === 0) {
      return {};
    }

    const currentArticle = article[0];

    return {
      title: currentArticle.title,
      description: currentArticle.excerpt,
      keywords: currentArticle.tags ? JSON.parse(currentArticle.tags).join(', ') : undefined,
      openGraph: {
        title: currentArticle.title,
        description: currentArticle.excerpt,
        type: 'article',
        publishedTime: currentArticle.publishedAt?.toISOString(),
        authors: [currentArticle.authorName],
        images: currentArticle.featuredImageUrl ? [{ url: currentArticle.featuredImageUrl, alt: currentArticle.title }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: currentArticle.title,
        description: currentArticle.excerpt,
        images: currentArticle.featuredImageUrl ? [currentArticle.featuredImageUrl] : undefined,
      },
    };
  } catch (error) {
    return {};
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, params.slug))
    .limit(1);

  if (article.length === 0) {
    notFound();
  }

  const currentArticle = article[0];

  let malePerson = null;
  let femalePerson = null;

  if (currentArticle.malePersonId) {
    const result = await db
      .select()
      .from(persons)
      .where(eq(persons.id, currentArticle.malePersonId))
      .limit(1);
    malePerson = result[0] || null;
  }

  if (currentArticle.femalePersonId) {
    const result = await db
      .select()
      .from(persons)
      .where(eq(persons.id, currentArticle.femalePersonId))
      .limit(1);
    femalePerson = result[0] || null;
  }

  const relatedArticles = await db
    .select()
    .from(articles)
    .where(eq(articles.status, 'published'))
    .orderBy(desc(articles.publishedAt))
    .limit(3);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <FadeIn className="mb-8">
            <Link href={`/${params.locale}/articles`}>
              <Button variant="ghost" size="sm">
                ← Back to Articles
              </Button>
            </Link>
          </FadeIn>

          <FadeIn className="mb-8">
            {currentArticle.category && (
              <span className="inline-block rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold border border-gold/30 mb-4">
                {currentArticle.category}
              </span>
            )}
            <h1 className="mb-6 text-5xl font-black text-text-primary lg:text-6xl leading-tight">
              {currentArticle.title}
            </h1>
            <p className="mb-6 text-xl text-text-secondary leading-relaxed">
              {currentArticle.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-text-secondary">
              {currentArticle.publishedAt && (
                <>
                  <span>
                    {new Date(currentArticle.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span>•</span>
                </>
              )}
              {currentArticle.readTimeMinutes && <span>{currentArticle.readTimeMinutes} min read</span>}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Featured Image */}
      {currentArticle.featuredImageUrl && (
        <FadeIn className="px-4 sm:px-6 lg:px-8 mb-12">
          <div className="mx-auto max-w-3xl">
            <div className="relative h-96 w-full overflow-hidden rounded-xl">
              <img
                src={currentArticle.featuredImageUrl}
                alt={currentArticle.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </FadeIn>
      )}

      {/* Content */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <FadeIn className="prose prose-invert max-w-none mb-12">
            <div className="text-lg leading-relaxed text-text-primary space-y-6 whitespace-pre-wrap">
              {currentArticle.content}
            </div>
          </FadeIn>

          {/* Featured Persons */}
          {(malePerson || femalePerson) && (
            <FadeIn className="my-12 border-t border-b border-border/30 py-12">
              <h2 className="mb-8 text-3xl font-bold text-text-primary">Featured In This Article</h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {malePerson && (
                  <Link href={`/${params.locale}/krtk/${malePerson.id}`}>
                    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-surface-elevated to-surface p-6 transition-all duration-300 hover:border-gold/60 hover:shadow-[0_0_30px_rgba(212,168,83,0.2)] cursor-pointer h-full">
                      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="relative z-10 flex flex-col items-center text-center">
                        {malePerson.profileImageUrl && (
                          <div className="relative h-24 w-24 mb-4 flex-shrink-0">
                            <img
                              src={malePerson.profileImageUrl}
                              alt={`${malePerson.firstName} ${malePerson.lastName}`}
                              className="h-full w-full rounded-full border-2 border-gold object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <h3 className="text-2xl font-bold text-text-primary group-hover:text-gold transition-colors duration-200">
                          {malePerson.firstName} {malePerson.lastName}
                        </h3>
                        {malePerson.currentPosition && (
                          <p className="text-sm font-semibold text-gold/90 mt-1">
                            {malePerson.currentPosition}
                          </p>
                        )}
                        {malePerson.currentCompany && (
                          <p className="text-xs text-text-secondary mt-1">
                            {malePerson.currentCompany}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                )}

                {femalePerson && (
                  <Link href={`/${params.locale}/krtk/${femalePerson.id}`}>
                    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-surface-elevated to-surface p-6 transition-all duration-300 hover:border-gold/60 hover:shadow-[0_0_30px_rgba(212,168,83,0.2)] cursor-pointer h-full">
                      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="relative z-10 flex flex-col items-center text-center">
                        {femalePerson.profileImageUrl && (
                          <div className="relative h-24 w-24 mb-4 flex-shrink-0">
                            <img
                              src={femalePerson.profileImageUrl}
                              alt={`${femalePerson.firstName} ${femalePerson.lastName}`}
                              className="h-full w-full rounded-full border-2 border-gold object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <h3 className="text-2xl font-bold text-text-primary group-hover:text-gold transition-colors duration-200">
                          {femalePerson.firstName} {femalePerson.lastName}
                        </h3>
                        {femalePerson.currentPosition && (
                          <p className="text-sm font-semibold text-gold/90 mt-1">
                            {femalePerson.currentPosition}
                          </p>
                        )}
                        {femalePerson.currentCompany && (
                          <p className="text-xs text-text-secondary mt-1">
                            {femalePerson.currentCompany}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </FadeIn>
          )}

          {/* Related Articles */}
          {relatedArticles.length > 1 && (
            <FadeIn className="mt-12">
              <h2 className="mb-8 text-3xl font-bold text-text-primary">More Stories</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {relatedArticles
                  .filter((a) => a.id !== currentArticle.id)
                  .slice(0, 3)
                  .map((relatedArticle) => (
                    <Link key={relatedArticle.id} href={`/${params.locale}/articles/${relatedArticle.slug}`}>
                      <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-surface-elevated to-surface transition-all duration-300 hover:border-gold/60 hover:shadow-[0_0_30px_rgba(212,168,83,0.2)] cursor-pointer h-full flex flex-col">
                        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {relatedArticle.featuredImageUrl && (
                          <div className="relative h-32 w-full overflow-hidden">
                            <img
                              src={relatedArticle.featuredImageUrl}
                              alt={relatedArticle.title}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}

                        <div className="relative z-10 flex flex-1 flex-col justify-between p-4">
                          <h3 className="text-lg font-bold text-text-primary group-hover:text-gold transition-colors duration-200 leading-tight">
                            {relatedArticle.title}
                          </h3>
                          <div className="text-xs text-text-secondary mt-2">
                            {relatedArticle.publishedAt
                              ? new Date(relatedArticle.publishedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : ''}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  );
}
