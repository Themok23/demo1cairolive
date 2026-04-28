import Link from 'next/link';
import { Experience } from '@/src/domain/entities/experience';
import { Heart, MapPin, BookOpen, Plane, Calendar } from 'lucide-react';

const typeIcons = {
  visit: MapPin,
  book_review: BookOpen,
  trip: Plane,
  event: Calendar,
} as const;

const typeLabels: Record<string, { en: string; ar: string }> = {
  visit:       { en: 'Visit',        ar: 'زيارة' },
  book_review: { en: 'Book Review',  ar: 'مراجعة كتاب' },
  trip:        { en: 'Trip',         ar: 'رحلة' },
  event:       { en: 'Event',        ar: 'فعالية' },
};

interface Props {
  experience: Experience;
  locale: 'en' | 'ar';
}

export default function ExperienceCard({ experience, locale }: Props) {
  const isAr = locale === 'ar';
  const title = isAr && experience.titleAr ? experience.titleAr : experience.titleEn;
  const summary = isAr && experience.summaryAr ? experience.summaryAr : experience.summaryEn;
  const TypeIcon = typeIcons[experience.type as keyof typeof typeIcons] ?? MapPin;
  const typeLabel = typeLabels[experience.type]?.[locale] ?? experience.type;

  return (
    <Link
      href={`/${locale}/experiences/${experience.slug}` as any}
      className="group block rounded-xl border border-gold/10 bg-surface hover:border-gold/30 transition-all duration-200 overflow-hidden"
    >
      {experience.coverImageUrl ? (
        <div className="relative h-40 overflow-hidden">
          <img
            src={experience.coverImageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-br from-gold/5 to-surface-elevated flex items-center justify-center">
          <TypeIcon size={32} className="text-gold/30" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <TypeIcon size={12} className="text-gold" />
          <span className="text-xs text-gold uppercase tracking-wide">{typeLabel}</span>
        </div>
        <h3 className="font-semibold text-text-primary line-clamp-2 group-hover:text-gold transition-colors">
          {title}
        </h3>
        {summary && (
          <p className="text-sm text-text-secondary mt-1 line-clamp-2">{summary}</p>
        )}
        <div className="flex items-center gap-3 mt-3 text-xs text-text-tertiary">
          {experience.submittedByName && (
            <span>{isAr ? 'بقلم' : 'by'} {experience.submittedByName}</span>
          )}
          <span className="flex items-center gap-1">
            <Heart size={11} />
            {experience.likeCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
