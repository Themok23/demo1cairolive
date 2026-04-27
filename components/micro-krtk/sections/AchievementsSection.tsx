import { PersonAchievement } from '@/src/domain/entities/personAchievement';

interface Props {
  items: PersonAchievement[];
  locale: 'en' | 'ar';
}

export default function AchievementsSection({ items, locale }: Props) {
  if (items.length === 0) return null;
  const isAr = locale === 'ar';

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-lg font-semibold text-text-primary mb-4 border-b border-gold/20 pb-2">
        {isAr ? 'الإنجازات' : 'Achievements'}
      </h2>
      <div className="space-y-4">
        {items.map((item) => {
          const title = isAr && item.titleAr ? item.titleAr : item.titleEn;
          const description = isAr && item.descriptionAr ? item.descriptionAr : item.descriptionEn;

          return (
            <div key={item.id} className="flex gap-4 items-start">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={title} className="w-10 h-10 rounded object-cover flex-shrink-0" />
              )}
              <div>
                <p className="font-medium text-text-primary">{title}</p>
                {description && <p className="text-sm text-text-secondary mt-0.5">{description}</p>}
                {item.externalLink && (
                  <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:underline mt-1 inline-block">
                    {isAr ? 'عرض المزيد' : 'Learn more'}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
