import Link from 'next/link';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren from '@/components/animations/StaggerChildren';
import { db } from '@/src/infrastructure/db/client';
import { persons } from '@/src/infrastructure/db/schema';
import { desc } from 'drizzle-orm';
import { ArrowRight } from 'lucide-react';
<<<<<<< HEAD
import TierBadge from '@/components/ui/TierBadge';
=======
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126

interface PeoplePageProps {
  params: {
    locale: string;
  };
}

export default async function PeoplePage({ params }: PeoplePageProps) {
<<<<<<< HEAD
  const { locale } = await params;
=======
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
  const allPeople = await db
    .select()
    .from(persons)
    .orderBy(desc(persons.createdAt));

<<<<<<< HEAD
  const isAr = locale === 'ar';

=======
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative border-b border-border/30 bg-gradient-to-b from-surface-elevated via-surface-elevated/50 to-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-40" />

        <div className="relative mx-auto max-w-7xl">
          <FadeIn>
            <div className="mb-6 inline-block rounded-full border border-gold/30 bg-gold/5 px-4 py-2">
<<<<<<< HEAD
              <p className="text-sm font-semibold text-gold">
                {isAr ? 'دليل' : 'Directory'}
              </p>
            </div>
            <h1 className="mb-4 text-5xl font-bold text-text-primary lg:text-6xl">
              {isAr ? 'استكشف' : 'Browse'} <span className="gradient-text">{isAr ? 'الملفات' : 'Profiles'}</span>
            </h1>
            <p className="max-w-2xl text-xl text-text-secondary leading-relaxed">
              {isAr
                ? 'اكتشف أفراداً استثنائيين من القاهرة وما حولها. استكشف إنجازاتهم وخبرتهم وقصصهم.'
                : 'Discover remarkable individuals from Cairo and beyond. Explore their achievements, expertise, and stories.'}
=======
              <p className="text-sm font-semibold text-gold">Directory</p>
            </div>
            <h1 className="mb-4 text-5xl font-bold text-text-primary lg:text-6xl">
              Browse <span className="gradient-text">Profiles</span>
            </h1>
            <p className="max-w-2xl text-xl text-text-secondary leading-relaxed">
              Discover remarkable individuals from Cairo and beyond. Explore their achievements, expertise, and stories.
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
            </p>
          </FadeIn>
        </div>
      </section>

      {/* People Grid */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <StaggerChildren className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {allPeople.map((person) => (
              <div key={person.id} data-stagger>
<<<<<<< HEAD
                <Link href={`/${locale}/krtk/${person.id}`}>
=======
                <Link href={`/${params.locale}/krtk/${person.id}`}>
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
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
<<<<<<< HEAD
                        {person.tier && (
                          <div className="ml-auto">
                            <TierBadge tier={person.tier} size="sm" />
=======
                        {(person.tier === 'gold' || person.tier === 'platinum' || person.tier === 'silver') && (
                          <div className="ml-auto rounded-lg bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold border border-gold/30">
                            {person.tier.toUpperCase()}
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
                          </div>
                        )}
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
                        {person.keywords && (() => {
                          try {
                            const keywords = JSON.parse(person.keywords || '[]');
                            if (Array.isArray(keywords) && keywords.length > 0) {
                              return (
                                <div className="flex flex-wrap gap-1">
                                  {keywords.slice(0, 2).map((keyword: string, index: number) => (
                                    <span
                                      key={index}
<<<<<<< HEAD
                                      className="inline-block rounded-full bg-gold/10 px-2 py-0.5 text-xs font-semibold text-gold border border-gold/30"
=======
                                      className="inline-block rounded-full bg-gold/10 px-2 py-1 text-xs font-semibold text-gold border border-gold/30"
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
                                    >
                                      {keyword}
                                    </span>
                                  ))}
                                  {keywords.length > 2 && (
<<<<<<< HEAD
                                    <span className="inline-block rounded-full bg-gold/10 px-2 py-0.5 text-xs font-semibold text-gold border border-gold/30">
=======
                                    <span className="inline-block rounded-full bg-gold/10 px-2 py-1 text-xs font-semibold text-gold border border-gold/30">
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
                                      +{keywords.length - 2}
                                    </span>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          } catch {
                            return null;
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </StaggerChildren>
<<<<<<< HEAD
        </div>

        {allPeople.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary mb-6">
              {isAr ? 'لا توجد ملفات حالياً' : 'No profiles yet'}
            </p>
            <Link href={`/${locale}/submit`}>
              <Button gap="gap-2">
                {isAr ? 'كن أول من ينضم' : 'Be the First to Join'}
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
=======

          {allPeople.length === 0 && (
            <FadeIn className="text-center py-12">
              <p className="text-lg text-text-secondary mb-6">No profiles yet. Be the first to submit yours!</p>
              <Button variant="primary" size="lg">
                <Link href="/submit" className="flex items-center gap-2">
                  Submit Your Profile
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
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
