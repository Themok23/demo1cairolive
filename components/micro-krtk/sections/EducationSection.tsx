import { PersonEducation } from '@/src/domain/entities/personEducation';

interface Props {
  items: PersonEducation[];
  locale: 'en' | 'ar';
}

export default function EducationSection({ items, locale }: Props) {
  if (items.length === 0) return null;
  const isAr = locale === 'ar';

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-lg font-semibold text-text-primary mb-4 border-b border-gold/20 pb-2">
        {isAr ? 'التعليم' : 'Education'}
      </h2>
      <div className="space-y-4">
        {items.map((item) => {
          const institution = isAr && item.institutionAr ? item.institutionAr : item.institutionEn;
          const degree = isAr && item.degreeAr ? item.degreeAr : item.degreeEn;
          const field = isAr && item.fieldAr ? item.fieldAr : item.fieldEn;
          const years = [item.fromYear, item.toYear].filter(Boolean).join(' — ');

          return (
            <div key={item.id} className="flex gap-4 items-start">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={institution} className="w-10 h-10 rounded object-cover flex-shrink-0" />
              )}
              <div>
                <p className="font-medium text-text-primary">{institution}</p>
                {degree && <p className="text-sm text-text-secondary">{degree}{field ? ` · ${field}` : ''}</p>}
                {years && <p className="text-xs text-text-tertiary mt-0.5">{years}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
