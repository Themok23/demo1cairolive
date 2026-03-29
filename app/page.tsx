import Link from 'next/link';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren from '@/components/animations/StaggerChildren';
import { db } from '@/src/infrastructure/db/client';
import { persons, articles } from '@/src/infrastructure/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Star, BookOpen, Users, ArrowRight } from 'lucide-react';
import AnimatedHero from '@/components/client/AnimatedHero';

export default async function Home() {
  const featuredPeople = await db
    .select()
    .from(persons)
    .limit(4);

  const latestArticles = await db
    .select()
    .from(articles)
    .where(eq(articles.status, 'published'))
    .orderBy(desc(articles.publishedAt))
    .limit(4);

  return (
    <>
      <AnimatedHero />

      {/* Featured Profiles Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-text-primary lg:text-5xl">
              Featured <span className="gradient-text">Profiles</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-text-secondary">
              Meet some of the extraordinary people featured on Cairo Live
            </p>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredPeople.map((person) => (
              <div key={person.id} data-stagger>
                <Link href={`/krtk/${person.id}`}>
                  <div className="group relative h-72 overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-surface-elevated to-surface p-6 transition-all duration-300 hover:border-gold/60 hover:shadow-[0_0_30px_rgba(212,168,83,0.2)] hover:-translate-y-2 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10 flex h-full flex-col justify-between">
                      <div className="flex items-start justify-between">
                        {person.profileImageUrl && (
                          <div className="relative h-20 w-20 flex-shrink-0">
                            <img
                              src={person.profileImageUrl}
                              alt={`${person.firstName} ${person.lastName}`}
                              className="h-full w-full rounded-full border-2 border-gold object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                        {person.tier === 'gold' || person.tier === 'platinum' ? (
                          <div className="ml-auto rounded-lg bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold border border-gold/30">
                            {person.tier.toUpperCase()}
                          </div>
                        ) : null}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-text-primary leading-tight group-hover:text-gold transition-colors duration-200">
                            {person.firstName}
                          </h3>
                          <h4 className="text-lg font-bold text-text-primary/70 leading-tight">
                            {person.lastName}
                          </h4>
                        </div>
                        {person.currentPosition && (
                          <p className="text-sm font-semibold text-gold/90 leading-tight">
                            {person.currentPosition}
                          </p>
                        )}
                        {person.currentCompany && (
                          <p className="text-xs text-text-secondary leading-tight truncate">
                            {person.currentCompany}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-text-primary lg:text-5xl">
              Latest <span className="gradient-text">Stories</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-text-secondary">
              Discover inspiring stories and insights from remarkable Egyptians
            </p>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {latestArticles.map((article) => (
              <div key={article.id} data-stagger>
                <Link href={`/articles/${article.slug}`}>
                  <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-surface-elevated to-surface transition-all duration-300 hover:border-gold/60 hover:shadow-[0_0_30px_rgba(212,168,83,0.2)] hover:-translate-y-2 cursor-pointer h-full flex flex-col">
                    <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {article.featuredImageUrl && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={article.featuredImageUrl}
                          alt={article.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="relative z-10 flex flex-1 flex-col justify-between p-6">
                      <div>
                        <h3 className="mb-2 text-xl font-bold text-text-primary group-hover:text-gold transition-colors duration-200 leading-tight">
                          {article.title}
                        </h3>
                        <p className="text-sm text-text-secondary mb-4 line-clamp-2">
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

          <FadeIn className="mt-10 text-center">
            <Button variant="outline" size="lg">
              <Link href="/articles" className="flex items-center gap-2">
                View All Stories
                <ArrowRight size={18} />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <FadeIn className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-text-primary lg:text-5xl">
              How It Works
            </h2>
            <p className="text-lg text-text-secondary">
              Three simple steps to showcase your remarkable story
            </p>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                number: '01',
                title: 'Submit',
                description: 'Share your profile, achievements, and inspiring journey with our community.',
                icon: Users,
              },
              {
                number: '02',
                title: 'Discover',
                description: 'Get featured and discovered by thousands of remarkable people.',
                icon: Star,
              },
              {
                number: '03',
                title: 'Shine',
                description: 'Build your professional presence and connect with like-minded individuals.',
                icon: BookOpen,
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} data-stagger>
                  <FadeIn
                    delay={index * 0.1}
                    className="group relative overflow-hidden rounded-xl border border-border/30 bg-gradient-to-br from-surface-elevated/50 to-surface p-8 transition-all duration-300 hover:border-gold/50 hover:shadow-[0_0_30px_rgba(212,168,83,0.15)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10">
                      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-gold/20 to-amber/10 border border-gold/30">
                        <Icon size={32} className="text-gold" />
                      </div>
                      <div className="mb-4 text-5xl font-black text-gold/20">{step.number}</div>
                      <h3 className="mb-2 text-2xl font-bold text-text-primary">{step.title}</h3>
                      <p className="text-text-secondary leading-relaxed">{step.description}</p>
                    </div>
                  </FadeIn>
                </div>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* Subscribe CTA Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-surface-elevated via-surface to-surface-elevated opacity-40" />
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gold/5 blur-3xl" />

        <div className="relative mx-auto max-w-2xl text-center">
          <FadeIn>
            <h2 className="mb-4 text-4xl font-bold text-text-primary">
              Stay Updated
            </h2>
            <p className="mb-8 text-lg text-text-secondary">
              Subscribe to our newsletter and never miss out on new profiles and inspiring stories
            </p>
            <form action="/api/subscribers" method="POST" className="flex flex-col gap-3 sm:flex-row sm:gap-0">
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                required
                className="flex-1 rounded-l-lg border border-border/50 bg-surface px-4 py-3 text-text-primary placeholder-text-secondary focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
              <Button variant="primary" size="lg" className="rounded-r-lg">
                Subscribe
              </Button>
            </form>
            <p className="mt-4 text-sm text-text-secondary">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <FadeIn>
            <h2 className="mb-4 text-4xl font-bold text-text-primary lg:text-5xl">
              Share Your Story
            </h2>
            <p className="mb-8 text-lg text-text-secondary">
              Every remarkable person deserves to be celebrated. Submit your profile today and become part of our community.
            </p>
            <Button variant="primary" size="lg">
              <Link href="/submit" className="flex items-center gap-2">
                Submit Your Profile
                <ArrowRight size={18} />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
