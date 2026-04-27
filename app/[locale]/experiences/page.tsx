import { DrizzleExperienceRepository } from '@/src/infrastructure/repositories/drizzleExperienceRepository';
import { ListPublishedExperiencesUseCase } from '@/src/application/use-cases/experiences/listPublishedExperiences';
import ExperienceCard from '@/components/experiences/ExperienceCard';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ pillarId?: string; type?: string }>;
}

export default async function ExperiencesFeedPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { pillarId, type } = await searchParams;
  const isAr = locale === 'ar';

  const result = await new ListPublishedExperiencesUseCase(new DrizzleExperienceRepository()).execute({
    pillarId, type, limit: 24,
  });
  const experiences = result.data ?? [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              {isAr ? 'تجارب القاهرة' : 'Cairo Experiences'}
            </h1>
            <p className="text-text-secondary mt-1">
              {isAr ? 'قصص حقيقية من قلب مصر' : 'Real stories from the heart of Egypt'}
            </p>
          </div>
          <Link
            href={`/${locale}/experiences/submit` as any}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-background text-sm font-semibold hover:bg-gold/90 transition-colors"
          >
            <Plus size={16} />
            {isAr ? 'شارك تجربتك' : 'Share Yours'}
          </Link>
        </div>

        {experiences.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-text-secondary text-lg">
              {isAr ? 'لا توجد تجارب منشورة بعد.' : 'No experiences published yet.'}
            </p>
            <Link href={`/${locale}/experiences/submit` as any} className="text-gold hover:underline mt-2 inline-block">
              {isAr ? 'كن الأول!' : 'Be the first!'}
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} locale={isAr ? 'ar' : 'en'} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
