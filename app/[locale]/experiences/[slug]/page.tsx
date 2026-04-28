import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { DrizzleExperienceRepository } from '@/src/infrastructure/repositories/drizzleExperienceRepository';
import { GetExperienceBySlugUseCase } from '@/src/application/use-cases/experiences/getExperienceBySlug';
import ReactionBar from '@/components/experiences/ReactionBar';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ExperienceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const isAr = locale === 'ar';

  const result = await new GetExperienceBySlugUseCase(new DrizzleExperienceRepository()).execute(slug);
  if (!result.success || !result.data || result.data.status !== 'published') notFound();

  const exp = result.data;
  const title = isAr && exp.titleAr ? exp.titleAr : exp.titleEn;
  const summary = isAr && exp.summaryAr ? exp.summaryAr : exp.summaryEn;
  const content = isAr && exp.contentAr ? exp.contentAr : exp.contentEn;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href={`/${locale}/experiences` as any}
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          {isAr ? 'العودة للتجارب' : 'Back to Experiences'}
        </Link>

        {exp.coverImageUrl && (
          <div className="rounded-2xl overflow-hidden mb-6 aspect-video">
            <img src={exp.coverImageUrl} alt={title} className="w-full h-full object-cover" />
          </div>
        )}

        <h1 className="text-3xl font-bold text-text-primary mb-3">{title}</h1>
        {summary && <p className="text-lg text-text-secondary mb-6 leading-relaxed">{summary}</p>}

        <div className="flex items-center gap-4 text-sm text-text-tertiary mb-8 pb-6 border-b border-gold/10">
          {exp.submittedByName && (
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {exp.submittedByName}
            </span>
          )}
          {exp.publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(exp.publishedAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { dateStyle: 'medium' })}
            </span>
          )}
        </div>

        {content && (
          <div className="prose prose-invert max-w-none text-text-secondary leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-gold/10">
          <ReactionBar experienceId={exp.id} likeCount={exp.likeCount} locale={isAr ? 'ar' : 'en'} />
        </div>
      </div>
    </div>
  );
}
