import Link from 'next/link';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/animations/FadeIn';
import { db } from '@/src/infrastructure/db/client';
import { persons, articles } from '@/src/infrastructure/db/schema';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { CheckCircle2, Linkedin, Twitter, Instagram, Globe, ArrowRight } from 'lucide-react';

interface KrtkPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export default async function KrtkProfilePage({ params }: KrtkPageProps) {
  const person = await db
    .select()
    .from(persons)
    .where(eq(persons.id, params.slug))
    .limit(1);

  if (person.length === 0) {
    notFound();
  }

  const currentPerson = person[0];

  const featuredArticles = await db
    .select()
    .from(articles)
    .where(
      eq(articles.status, 'published')
      // Articles where this person is either male or female featured
    )
    .orderBy(desc(articles.publishedAt))
    .limit(3);

  // Filter articles to only show ones featuring this person
  const relatedArticles = featuredArticles.filter(
    (article) => article.malePersonId === currentPerson.id || article.femalePersonId === currentPerson.id
  );

  return (
    <div className="min-h-screen">
      {/* Header Navigation */}
      <section className="px-4 py-6 sm:px-6 lg:px-8 border-b border-border/30">
        <div className="mx-auto max-w-7xl">
          <Link href={`/${params.locale}/krtk`}>
            <Button variant="ghost" size="sm">
              ← Back to Directory
            </Button>
          </Link>
        </div>
      </section>

      {/* Hero Profile Section */}
      <section className="relative overflow-hidden">
        {/* Background with cover image or gradient */}
        {currentPerson.coverImageUrl ? (
          <div className="absolute inset-0 h-96">
            <img
              src={currentPerson.coverImageUrl}
              alt="Cover"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
          </div>
        ) : (
          <div className="absolute inset-0 h-96 bg-gradient-to-br from-gold/10 via-surface to-background" />
        )}

        <div className="relative px-4 py-20 sm:px-6 lg:px-8 pt-40">
          <div className="mx-auto max-w-7xl">
            <FadeIn className="flex flex-col gap-8 md:flex-row md:items-end">
              {/* Profile Photo */}
              {currentPerson.profileImageUrl && (
                <div className="relative h-40 w-40 flex-shrink-0">
                  <img
                    src={currentPerson.profileImageUrl}
                    alt={`${currentPerson.firstName} ${currentPerson.lastName}`}
                    className="h-full w-full rounded-2xl border-4 border-gold object-cover shadow-2xl"
                  />
                  {currentPerson.isVerified && (
                    <div className="absolute -bottom-2 -right-2 rounded-full bg-green-500 p-2 border-4 border-background">
                      <CheckCircle2 size={24} className="text-white" />
                    </div>
                  )}
                </div>
              )}

              {/* Profile Info */}
              <div className="mb-6">
                <h1 className="mb-2 text-6xl font-black text-text-primary leading-tight">
                  {currentPerson.firstName}
                </h1>
                <h2 className="mb-6 text-4xl font-bold text-text-primary/70 leading-tight">
                  {currentPerson.lastName}
                </h2>

                {currentPerson.currentPosition && (
                  <p className="mb-2 text-xl font-bold text-gold">
                    {currentPerson.currentPosition}
                  </p>
                )}
                {currentPerson.currentCompany && (
                  <p className="mb-4 text-lg text-text-secondary">
                    {currentPerson.currentCompany}
                  </p>
                )}

                {/* Tier and Verification */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {currentPerson.tier && (
                    <span className="inline-block rounded-full bg-gold/10 px-4 py-2 text-sm font-bold text-gold border border-gold/30">
                      {currentPerson.tier.toUpperCase()} TIER
                    </span>
                  )}
                  {currentPerson.isClaimed && (
                    <span className="inline-block rounded-full bg-green-500/10 px-4 py-2 text-sm font-bold text-green-400 border border-green-500/30">
                      CLAIMED
                    </span>
                  )}
                </div>

                {/* Keywords */}
                {currentPerson.keywords && (() => {
                  try {
                    const keywords = JSON.parse(currentPerson.keywords || '[]');
                    if (Array.isArray(keywords) && keywords.length > 0) {
                      return (
                        <div className="flex flex-wrap gap-2">
                          {keywords.map((keyword: string, index: number) => (
                            <span
                              key={index}
                              className="inline-block rounded-full bg-gold/10 px-3 py-1 text-sm font-semibold text-gold border border-gold/30"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  } catch {
                    return null;
                  }
                })()}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Left Column - Bio and Details */}
            <div className="lg:col-span-2">
              {/* Bio */}
              {currentPerson.bio && (
                <FadeIn className="mb-12">
                  <h2 className="mb-6 text-3xl font-bold text-text-primary">About</h2>
                  <div className="text-lg leading-relaxed text-text-primary space-y-4 border-l-4 border-gold pl-6">
                    {currentPerson.bio.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-text-secondary">{paragraph}</p>
                    ))}
                  </div>
                </FadeIn>
              )}

              {/* Location and Details */}
              {currentPerson.location && (
                <FadeIn className="mb-12">
                  <h2 className="mb-6 text-3xl font-bold text-text-primary">Location</h2>
                  <p className="text-lg text-text-secondary">{currentPerson.location}</p>
                </FadeIn>
              )}

              {/* Social Links */}
              {(currentPerson.linkedinUrl || currentPerson.twitterUrl || currentPerson.instagramUrl || currentPerson.websiteUrl) && (
                <FadeIn className="mb-12">
                  <h2 className="mb-6 text-3xl font-bold text-text-primary">Connect</h2>
                  <div className="flex flex-wrap gap-3">
                    {currentPerson.linkedinUrl && (
                      <a
                        href={currentPerson.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-gold/10 px-4 py-2 text-gold border border-gold/30 hover:bg-gold/20 transition-colors"
                      >
                        <Linkedin size={18} />
                        LinkedIn
                      </a>
                    )}
                    {currentPerson.twitterUrl && (
                      <a
                        href={currentPerson.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-gold/10 px-4 py-2 text-gold border border-gold/30 hover:bg-gold/20 transition-colors"
                      >
                        <Twitter size={18} />
                        Twitter
                      </a>
                    )}
                    {currentPerson.instagramUrl && (
                      <a
                        href={currentPerson.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-gold/10 px-4 py-2 text-gold border border-gold/30 hover:bg-gold/20 transition-colors"
                      >
                        <Instagram size={18} />
                        Instagram
                      </a>
                    )}
                    {currentPerson.websiteUrl && (
                      <a
                        href={currentPerson.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-gold/10 px-4 py-2 text-gold border border-gold/30 hover:bg-gold/20 transition-colors"
                      >
                        <Globe size={18} />
                        Website
                      </a>
                    )}
                  </div>
                </FadeIn>
              )}
            </div>

            {/* Right Column - Quick Info Card */}
            <div>
              <FadeIn className="sticky top-20 rounded-xl border border-border/50 bg-gradient-to-br from-surface-elevated to-surface p-6">
                <h3 className="mb-4 text-xl font-bold text-text-primary">Profile Card</h3>

                <div className="space-y-4 mb-6">
                  {currentPerson.currentPosition && (
                    <div>
                      <p className="text-xs font-semibold text-gold/70 mb-1">POSITION</p>
                      <p className="text-sm text-text-primary font-semibold">{currentPerson.currentPosition}</p>
                    </div>
                  )}

                  {currentPerson.currentCompany && (
                    <div>
                      <p className="text-xs font-semibold text-gold/70 mb-1">COMPANY</p>
                      <p className="text-sm text-text-primary font-semibold">{currentPerson.currentCompany}</p>
                    </div>
                  )}

                  {currentPerson.location && (
                    <div>
                      <p className="text-xs font-semibold text-gold/70 mb-1">LOCATION</p>
                      <p className="text-sm text-text-primary font-semibold">{currentPerson.location}</p>
                    </div>
                  )}

                  {currentPerson.tier && (
                    <div>
                      <p className="text-xs font-semibold text-gold/70 mb-1">TIER</p>
                      <p className="text-sm text-text-primary font-semibold uppercase">{currentPerson.tier}</p>
                    </div>
                  )}
                </div>

                {!currentPerson.isClaimed && (
                  <Button variant="outline" size="sm" className="w-full">
                    <Link href={`/${params.locale}/submit?profile=${currentPerson.id}`}>Claim Profile</Link>
                  </Button>
                )}
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {relatedArticles.length > 0 && (
        <section className="px-4 py-12 sm:px-6 lg:px-8 border-t border-border/30">
          <div className="mx-auto max-w-7xl">
            <FadeIn className="mb-12">
              <h2 className="mb-4 text-4xl font-bold text-text-primary">Featured In</h2>
              <p className="text-lg text-text-secondary">Stories featuring {currentPerson.firstName}</p>
            </FadeIn>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedArticles.map((article) => (
                <Link key={article.id} href={`/${params.locale}/articles/${article.slug}`}>
                  <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-surface-elevated to-surface transition-all duration-300 hover:border-gold/60 hover:shadow-[0_0_30px_rgba(212,168,83,0.2)] cursor-pointer h-full flex flex-col">
                    <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {article.featuredImageUrl && (
                      <div className="relative h-40 w-full overflow-hidden">
                        <img
                          src={article.featuredImageUrl}
                          alt={article.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="relative z-10 flex flex-1 flex-col justify-between p-4">
                      <h3 className="text-lg font-bold text-text-primary group-hover:text-gold transition-colors duration-200 leading-tight">
                        {article.title}
                      </h3>
                      <div className="text-xs text-text-secondary mt-2">
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString('en-US', {
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
          </div>
        </section>
      )}
    </div>
  );
}
