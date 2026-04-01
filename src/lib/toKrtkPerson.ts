import { localized, type Locale } from './locale';
import type { KrtkPerson } from '@/components/micro-krtk/Krtk';

/**
 * Maps a raw DB person row to the KrtkPerson shape
 * consumed by the reusable Krtk component.
 */
export function toKrtkPerson(
  person: {
    id: string;
    firstNameEn: string;
    firstNameAr?: string | null;
    lastNameEn: string;
    lastNameAr?: string | null;
    profileImageUrl?: string | null;
    currentPositionEn?: string | null;
    currentPositionAr?: string | null;
    currentCompanyEn?: string | null;
    currentCompanyAr?: string | null;
    tier?: string | null;
    keywords?: string | null;
  },
  loc: Locale
): KrtkPerson {
  let parsedKeywords: string[] = [];
  try {
    const raw = JSON.parse(person.keywords || '[]');
    if (Array.isArray(raw)) parsedKeywords = raw;
  } catch {
    // ignore
  }

  return {
    id: person.id,
    name: localized(loc, person.firstNameEn, person.firstNameAr),
    lastName: localized(loc, person.lastNameEn, person.lastNameAr),
    imageUrl: person.profileImageUrl ?? null,
    position: localized(loc, person.currentPositionEn, person.currentPositionAr) || undefined,
    company: localized(loc, person.currentCompanyEn, person.currentCompanyAr) || undefined,
    tier: person.tier ?? undefined,
    keywords: parsedKeywords.length > 0 ? parsedKeywords : undefined,
  };
}
