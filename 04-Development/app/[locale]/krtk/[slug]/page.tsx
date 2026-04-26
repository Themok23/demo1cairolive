import Link from 'next/link';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/animations/FadeIn';
import { db } from '@/src/infrastructure/db/client';
import { persons } from '@/src/infrastructure/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import KrtkBusinessCard from '@/components/micro-krtk/KrtkBusinessCard';
import { ArrowLeft } from 'lucide-react';

interface KrtkPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function KrtkProfilePage({ params }: KrtkPageProps) {
  const { locale, slug } = await params;
  const person = await db
    .select()
    .from(persons)
    .where(eq(persons.id, slug))
    .limit(1);

  if (person.length === 0) {
    notFound();
  }

  const rawPerson = person[0];
  const currentPerson = { ...rawPerson, isVerified: rawPerson.isVerified ?? undefined, isClaimed: rawPerson.isClaimed ?? undefined };
  const isAr = locale === 'ar';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-surface-elevated via-background to-background dark:from-background dark:via-background dark:to-background">
      {/* Minimal back link */}
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <Link
            href={`/${locale}/krtk`}
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            {isAr ? 'العودة للدليل' : 'Back to Directory'}
          </Link>
        </div>
      </div>

      {/* Card centered on page */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
        {/* Ambient glow behind card in light mode */}
        <div className="absolute inset-0 pointer-events-none dark:hidden overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-gold/[0.05] blur-[120px]" />
        </div>
        <div className="relative w-full max-w-2xl">
          <FadeIn>
            <KrtkBusinessCard person={currentPerson} locale={locale} />
          </FadeIn>
        </div>
      </div>
    </div>
  );
}