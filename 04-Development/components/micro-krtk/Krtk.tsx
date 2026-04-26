import Link from 'next/link';
import Image from 'next/image';
import TierBadge from '@/components/ui/TierBadge';
import { ArrowRight } from 'lucide-react';

export interface KrtkPerson {
  id: string;
  name: string;
  lastName?: string;
  position?: string;
  company?: string;
  imageUrl: string | null;
  tier?: string;
  keywords?: string[];
}

interface KrtkProps {
  person: KrtkPerson;
  locale?: string;
  /** data attribute forwarded for GSAP / stagger animations */
  'data-card'?: boolean;
  'data-stagger'?: boolean;
}

export default function Krtk({ person, locale = 'en', ...rest }: KrtkProps) {
  const isAr = locale === 'ar';

  return (
    <div className="group" {...rest}>
      <div className="relative flex flex-col overflow-hidden rounded-2xl border border-border dark:border-border/40 bg-surface shadow-sm dark:shadow-none dark:bg-gradient-to-b dark:from-surface-elevated dark:to-surface transition-all duration-300 hover:border-gold/50 hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_40px_rgba(212,168,83,0.15)] hover:-translate-y-1">
        {/* Hover shimmer */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Body - links to profile page */}
        <Link href={`/${locale}/people/${person.id}`} className="relative z-10 block p-6">
          {/* Top row: avatar + tier badge */}
          <div className="flex items-start justify-between mb-5">
            {/* Round avatar with gold ring */}
            <div data-avatar className="relative h-20 w-20 flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold via-amber-400 to-gold p-[2px]">
                <div className="h-full w-full rounded-full overflow-hidden bg-surface">
                  {person.imageUrl ? (
                    <Image
                      src={person.imageUrl}
                      alt={person.lastName ? `${person.name} ${person.lastName}` : person.name}
                      fill
                      className="object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gold/20 to-surface">
                      <span className="text-2xl font-bold text-gold">
                        {person.name.charAt(0)}{person.lastName ? person.lastName.charAt(0) : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Gold dot indicator */}
              <span className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full bg-gold border-2 border-background block" />
            </div>

            {/* Tier badge */}
            {person.tier && <TierBadge tier={person.tier} size="sm" />}
          </div>

          {/* Name + role */}
          <div className="space-y-1.5">
            <div>
              <h3 className="text-xl font-bold text-text-primary leading-tight group-hover:text-gold transition-colors duration-200" lang={locale}>
                {person.name}
              </h3>
              {person.lastName && (
                <h4 className="text-lg font-bold text-text-primary/70 leading-tight" lang={locale}>
                  {person.lastName}
                </h4>
              )}
            </div>
            {person.position && (
              <p className="text-sm font-semibold text-gold/90 leading-snug" lang={locale}>
                {person.position}
              </p>
            )}
            {person.company && (
              <p className="text-xs text-text-secondary truncate" lang={locale}>
                {person.company}
              </p>
            )}

            {/* Keywords */}
            {person.keywords && person.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {person.keywords.slice(0, 2).map((kw, i) => (
                  <span
                    key={i}
                    className="inline-block rounded-full bg-gold/10 px-2 py-0.5 text-xs font-semibold text-gold border border-gold/30"
                  >
                    {kw}
                  </span>
                ))}
                {person.keywords.length > 2 && (
                  <span className="inline-block rounded-full bg-gold/10 px-2 py-0.5 text-xs font-semibold text-gold border border-gold/30">
                    +{person.keywords.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>

        {/* Divider */}
        <div className="relative z-10 mx-6 h-px bg-gradient-to-r from-transparent via-border dark:via-gold/30 to-transparent" />

        {/* Action row */}
        <div className="relative z-10 flex items-center justify-between px-6 py-3">
          <Link
            href={`/${locale}/people/${person.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold/70 hover:text-gold transition-colors duration-200"
          >
            <span>{isAr ? 'عرض الملف الشخصي' : 'View Profile'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <Link
            href={`/${locale}/krtk/${person.id}`}
            className="text-xs text-text-secondary hover:text-gold transition-colors"
            aria-label={isAr ? 'عرض البطاقة الرقمية' : 'View digital profile'}
          >
            {isAr ? 'البطاقة' : 'KRTK'}
          </Link>
        </div>
      </div>
    </div>
  );
}
