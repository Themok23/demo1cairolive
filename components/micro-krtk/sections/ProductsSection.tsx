import { PersonProduct } from '@/src/domain/entities/personProduct';

interface Props {
  items: PersonProduct[];
  locale: 'en' | 'ar';
}

export default function ProductsSection({ items, locale }: Props) {
  const active = items.filter((i) => i.isActive);
  if (active.length === 0) return null;
  const isAr = locale === 'ar';

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-lg font-semibold text-text-primary mb-4 border-b border-gold/20 pb-2">
        {isAr ? 'المنتجات' : 'Products'}
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {active.map((item) => {
          const title = isAr && item.titleAr ? item.titleAr : item.titleEn;
          const description = isAr && item.descriptionAr ? item.descriptionAr : item.descriptionEn;

          return (
            <div key={item.id} className="rounded-lg border border-gold/10 bg-surface-elevated p-4">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={title} className="w-full h-28 object-cover rounded mb-3" />
              )}
              <p className="font-medium text-text-primary">{title}</p>
              {item.priceText && <p className="text-xs text-gold mt-0.5">{item.priceText}</p>}
              {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
              {item.externalLink && (
                <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:underline mt-2 inline-block">
                  {isAr ? 'اشترِ الآن' : 'Buy now'}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
