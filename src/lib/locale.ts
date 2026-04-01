export type Locale = 'en' | 'ar';

/**
 * Returns the value for the current locale, falling back to the other language
 * if the requested one is empty or null. Never returns undefined.
 *
 * Usage:
 *   localized(locale, person.firstNameEn, person.firstNameAr)
 */
export function localized(
  locale: Locale,
  en: string | null | undefined,
  ar: string | null | undefined
): string {
  if (locale === 'ar') return (ar && ar.trim()) ? ar : (en || '');
  return (en && en.trim()) ? en : (ar || '');
}

/** Returns 'rtl' for Arabic, 'ltr' for English. */
export function dir(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

/** Returns the appropriate locale string for toLocaleDateString. */
export function dateLocale(locale: Locale): string {
  return locale === 'ar' ? 'ar-EG' : 'en-US';
}
