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
  const isAr = params.locale === 'ar';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Minimal back link */}
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <Link
            href={`/${params.locale}/krtk`}
            className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-[#D4A853] transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            {isAr ? 'العودة للدليل' : 'Back to Directory'}
          </Link>
        </div>
      </div>

      {/* Card centered on page */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
        <div className="w-full max-w-2xl">
          <FadeIn>
            <KrtkBusinessCard person={currentPerson} locale={params.locale} />
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
