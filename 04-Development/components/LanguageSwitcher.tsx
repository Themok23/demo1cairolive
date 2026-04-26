'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/') as any);
  };

  return (
    <button
      onClick={toggleLocale}
      className="px-3 py-1.5 rounded-lg text-sm font-medium border border-white/10 hover:border-[#D4A853]/50 hover:text-[#D4A853] transition-all duration-200"
      aria-label={locale === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      {locale === 'en' ? 'AR' : 'EN'}
    </button>
  );
}
