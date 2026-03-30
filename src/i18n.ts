import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'ar'] as const;
export const defaultLocale = 'ar' as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) || defaultLocale;
  if (!locales.includes(locale as Locale)) notFound();
  return {
    locale: locale as Locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
<<<<<<< HEAD
});
=======
});
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
