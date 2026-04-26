import Link from 'next/link';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren from '@/components/animations/StaggerChildren';
import { db } from '@/src/infrastructure/db/client';
import { persons } from '@/src/infrastructure/db/schema';
import { desc } from 'drizzle-orm';
import { Sparkles, ArrowRight } from 'lucide-react';
import TierBadge from '@/components/ui/TierBadge';
import { localized, type Locale } from '@/src/lib/locale';

interface KrtkPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function KrtkPage({ params }: KrtkPageProps) {
  const { locale } = await params;
  const allPeople = await db
    .select()
    .from(persons)
    .orderBy(desc(persons.createdAt))
    .limit(60);

  const isAr = locale === 'ar';
  const loc = locale as Locale;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative border-b border-border/30 bg-gradient-to-b from-surface-elevated via-surface-elevated/50 to-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-40" />

        <div className="relative mx-auto max-w-7xl">
          <FadeIn>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-2">
              <Sparkles size={16} className="text-gold" />
              <p className="text-sm font-semibold text-gold">
                {isAr ? 'KRTK - اعرف الأطفال الموهوبين المميزين' : 'KRTK - Know Remarkable Talented Kids'}
              </p>
            </div>
            <h1 className="mb-4 text-5xl font-bold text-text-primary lg:text-6xl">
              {isAr ? 'ملفات' : 'Micro'} <span className="gradient-text">{isAr ? 'مصغرة' : 'Profiles'}</span>
            </h1>
            <p className="max-w-2xl text-xl text-text-secondary leading-relaxed">
              {isAr
                ? 'احتفل بالمواهب الصاعدة والأصوات الناشئة. KRTK هو دليل بطاقات عملنا الرقمية يعرض الجيل القادم من المصريين الاستثنائيين'
                : 'Celebrate rising talents and emerging voices. KRTK is our digital business card directory featuring the next generation of remarkable Egyptians.'}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Business Cards Grid */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <StaggerChildren className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {allPeople.map((person) => {
              const firstName = localized(loc, person.firstNameEn, person.firstNameAr);
              const lastName = localized(loc, person.lastNameEn, person.lastNameAr);
              const position = localized(loc, person.currentPositionEn, person.currentPositionAr);
              const company = localized(loc, person.currentCompanyEn, person.currentCompanyAr);

              return (
                <div key={person.id} data-stagger>
                  <Link href={`/${locale}/krtk/${person.id}`}>
                    <div className="group relative h-72 overflow-hidden rounded-xl border border-border bg-surface shadow-sm dark:border-border/50 dark:bg-gradient-to-br dark:from-surface-elevated dark:to-surface dark:shadow-none p-6 transition-all duration-300 hover:border-gold/60 hover:shadow-[0_0_30px_rgba(212,168,83,0.2)] hover:-translate-y-2 cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="relative z-10 flex h-full flex-col justify-between">
                        <div className="flex items-start justify-between">
                          {person.profileImageUrl && (
                            <div className="relative h-20 w-20 flex-shrink-0">
                              <img
                                src={person.profileImageUrl}
                                alt={`${firstName} ${lastName}`}
                                className="h-full w-full rounded-full border-2 border-gold object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          )}
                          {person.tier && (
                            <div className="ml-auto">
                              <TierBadge tier={person.tier} size="sm" />
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h3 className="text-xl font-bold text-text-primary leading-tight group-hover:text-gold transition-colors duration-200">
                              {firstName}
                            </h3>
                            <h4 className="text-lg font-bold text-text-primary/70 leading-tight">
                              {lastName}
                            </h4>
                          </div>
                          {position && (
                            <p className="text-sm font-semibold text-gold/90 leading-tight">
                              {position}
                            </p>
                          )}
                          {company && (
                            <p className="text-xs text-text-secondary leading-tight truncate">
                              {company}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </StaggerChildren>
        </div>

        {allPeople.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary mb-6">
              {isAr ? 'لا توجد ملفات حالياً' : 'No profiles yet'}
            </p>
            <Link href={`/${locale}/submit`}>
              <Button className="gap-2">
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
