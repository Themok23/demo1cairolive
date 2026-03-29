import Link from 'next/link';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren from '@/components/animations/StaggerChildren';
import { db } from '@/src/infrastructure/db/client';
import { articles, persons } from '@/src/infrastructure/db/schema';
import { eq, desc } from 'drizzle-orm';
import Button from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

interface ArticlesPageProps {
  params: {
    locale: string;
  };
}

export default async function ArticlesPage({ params }: ArticlesPageProps) {
  const publishedArticles = await db
    .select()
    .from(articles)
    .where(eq(articles.status, 'published'))
    .orderBy(desc(articles.publishedAt));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative border-b border-border/30 bg-gradient-to-b from-surface-elevated via-surface-elevated/50 to-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-40" />

        <div className="relative mx-auto max-w-7xl">
          <FadeIn>
            <div className="mb-6 inline-block rounded-full border border-gold/30 bg-gold/5 px-4 py-2">
              <p className="text-sm font-semibold text-gold">Stories & Insights</p>
            </div>
            <h1 className="mb-4 text-5xl font-bold text-text-primary lg:text-6xl">
              Latest <span className="gradient-text">Articles</span>
            </h1>
            <p className="max-w-2xl text-xl text-text-secondary leading-relaxed">
              Read inspiring stories, in-depth features, and insights about remarkable Egyptians and their remarkable journeys.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <StaggerChildren className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {publishedArticles.map((article) => (
              <div key={article.id} data-stagger>
                <Link href={`/${params.locale}/articles/${article.slug}`}>
                  <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-surface-elevated to-surface transition-all duration-300 hover:border-gold/60 hover:shadow-[0_0_30px_rgba(212,168,83,0.2)] hover:-translate-y-2 cursor-pointer h-full flex flex-col">
                    <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {article.featuredImageUrl && (
                      <div className="relative h-56 w-full overflow-hidden">
                        <img
                          src={article.featuredImageUrl}
                          alt={article.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="relative z-10 flex flex-1 flex-col justify-between p-6">
                      <div>
                        <div className="mb-3 flex items-center gap-2">
                          {article.category && (
                            <span className="inline-block rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold border border-gold/30">
                              {article.category}
                            </span>
                          )}
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-text-primary group-hover:text-gold transition-colors duration-200 leading-tight">
                          {article.title}
                        </h3>
                        <p className="text-sm text-text-secondary mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <span>
                            {article.publishedAt
                              ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : 'Not published'}
                          </span>
                          {article.readTimeMinutes && (
                            <>
                              <span>•</span>
                              <span>{article.readTimeMinutes} min read</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </StaggerChildren>

          {publishedArticles.length === 0 && (
            <FadeIn className="text-center">
              <p className="text-lg text-text-secondary mb-6">No published articles yet.</p>
              <Button variant="outline" size="lg">
                <Link href={`/${params.locale}/people`} className="flex items-center gap-2">
                  Browse Profiles
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  );
}
