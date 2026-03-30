import Link from 'next/link';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren from '@/components/animations/StaggerChildren';
import { db } from '@/src/infrastructure/db/client';
import { articles } from '@/src/infrastructure/db/schema';
import { eq, desc } from 'drizzle-orm';
import Button from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

interface ArticlesPageProps {
  params: {
    locale: string;
  };
}

export default async function ArticlesPage({ params }: ArticlesPageProps) {
  const { locale } = await params;
  const publishedArticles = await db
    .select()
    .from(articles)
    .where(eq(articles.status, 'published'))
    .orderBy(desc(articles.publishedAt));

  const isAr = locale === 'ar';

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative border-b border-border/30 bg-gradient-to-b from-surface-elevated via-surface-elevated/50 to-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-40" />

        <div className="relative mx-auto max-w-7xl">
          <FadeIn>
            <div className="mb-6 inline-block rounded-full border border-gold/30 bg-gold/5 px-4 py-2">
              <p className="text-sm font-semibold text-gold">
                {isAr ? 'القصص والرؤى' : 'Stories & Insights'}
              </p>
            </div>
            <h1 className="mb-4 text-5xl font-bold text-text-primary lg:text-6xl">
              {isAr ? 'أحدث' : 'Latest'} <span className="gradient-text">{isAr ? 'المقالات' : 'Articles'}</span>
            </h1>
            <p className="max-w-2xl text-xl text-text-secondary leading-relaxed">
              {isAr
                ? 'اقرأ قصص ملهمة وميزات متعمقة ورؤى حول المصريين الاستثنائيين ورحلاتهم المميزة'
                : 'Read inspiring stories, in-depth features, and insights about remarkable Egyptians and their remarkable journeys.'}
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
                <Link href={`/${locale}/articles/${article.slug}`}>
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
                        <p className="mb-4 text-text-secondary line-clamp-2">
                          {article.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border/30">
                        <div className="flex items-center gap-3 text-sm text-text-secondary">
                          {article.publishedAt && (
                            <span>
                              {new Date(article.publishedAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          )}
                          {article.readTimeMinutes && (
                            <>
                              <span>•</span>
                              <span>{article.readTimeMinutes} {isAr ? 'دقيقة' : 'min'}</span>
                            </>
                          )}
                        </div>
                        <ArrowRight size={18} className="text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </StaggerChildren>
        </div>

        {publishedArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary mb-6">
              {isAr ? 'لا توجد مقالات منشورة حالياً' : 'No articles published yet'}
            </p>
            <Link href={`/${locale}`}>
              <Button className="gap-2">
                {isAr ? 'العودة للرئيسية' : 'Back to Home'}
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}