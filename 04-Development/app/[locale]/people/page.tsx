import Link from 'next/link';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren from '@/components/animations/StaggerChildren';
import { db } from '@/src/infrastructure/db/client';
import { persons } from '@/src/infrastructure/db/schema';
import { desc } from 'drizzle-orm';
import { ArrowRight } from 'lucide-react';
import { localized, type Locale } from '@/src/lib/locale';
import Krtk from '@/components/micro-krtk/Krtk';
import { toKrtkPerson } from '@/src/lib/toKrtkPerson';

interface PeoplePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function PeoplePage({ params }: PeoplePageProps) {
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
            <div className="mb-6 inline-block rounded-full border border-gold/30 bg-gold/5 px-4 py-2">
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
                <Krtk
                  person={toKrtkPerson(person, loc)}
                  locale={locale}
                />
              </div>
            ))}
          </StaggerChildren>
        </div>

        {allPeople.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary mb-6">
              {isAr ? 'لا توجد ملفات حالياً' : 'No profiles yet'}
            </p>
            <Link href={`/${locale}/submit`}>
              <Button>
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
