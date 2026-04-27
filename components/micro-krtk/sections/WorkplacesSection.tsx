import { PersonWorkplace } from '@/src/domain/entities/personWorkplace';

interface Props {
  items: PersonWorkplace[];
  locale: 'en' | 'ar';
}

export default function WorkplacesSection({ items, locale }: Props) {
  if (items.length === 0) return null;
  const isAr = locale === 'ar';

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-lg font-semibold text-text-primary mb-4 border-b border-gold/20 pb-2">
        {isAr ? 'الخبرة المهنية' : 'Work Experience'}
      </h2>
      <div className="space-y-4">
        {items.map((item) => {
          const company = isAr && item.companyAr ? item.companyAr : item.companyEn;
          const position = isAr && item.positionAr ? item.positionAr : item.positionEn;
          const description = isAr && item.descriptionAr ? item.descriptionAr : item.descriptionEn;
          const from = item.fromDate ? new Date(item.fromDate).getFullYear() : null;
          const to = item.isCurrent ? (isAr ? 'الآن' : 'Present') : item.toDate ? new Date(item.toDate).getFullYear() : null;
          const range = [from, to].filter(Boolean).join(' — ');

          return (
            <div key={item.id} className="flex gap-4 items-start">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={company} className="w-10 h-10 rounded object-cover flex-shrink-0" />
              )}
              <div>
                <p className="font-medium text-text-primary">{company}</p>
                {position && <p className="text-sm text-text-secondary">{position}</p>}
                {range && <p className="text-xs text-text-tertiary mt-0.5">{range}</p>}
                {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
