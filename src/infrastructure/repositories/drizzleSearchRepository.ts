import { ilike, or, eq, and } from 'drizzle-orm';
import { db } from '../db/client';
import { persons, articles, pillars, places, experiences } from '../db/schema';
import { SearchRepository, SearchParams, SearchResult } from '../../domain/repositories/searchRepository';

export class DrizzleSearchRepository implements SearchRepository {
  async search({ q, limit = 20 }: SearchParams): Promise<SearchResult[]> {
    const term = `%${q.trim()}%`;
    const perKind = Math.ceil(limit / 5);

    const [ppl, art, pil, plc, exp] = await Promise.all([
      db.select({ id: persons.id, firstNameEn: persons.firstNameEn, lastNameEn: persons.lastNameEn, firstNameAr: persons.firstNameAr, lastNameAr: persons.lastNameAr, bioEn: persons.bioEn })
        .from(persons)
        .where(or(ilike(persons.firstNameEn, term), ilike(persons.lastNameEn, term), ilike(persons.firstNameAr, term), ilike(persons.lastNameAr, term)))
        .limit(perKind),

      db.select({ id: articles.id, slugEn: articles.slugEn, titleEn: articles.titleEn, titleAr: articles.titleAr, excerptEn: articles.excerptEn })
        .from(articles)
        .where(and(eq(articles.status, 'published'), or(ilike(articles.titleEn, term), ilike(articles.titleAr, term))))
        .limit(perKind),

      db.select({ id: pillars.id, slug: pillars.slug, nameEn: pillars.nameEn, nameAr: pillars.nameAr, descriptionEn: pillars.descriptionEn })
        .from(pillars)
        .where(or(ilike(pillars.nameEn, term), ilike(pillars.nameAr, term)))
        .limit(perKind),

      db.select({ id: places.id, slug: places.slug, nameEn: places.nameEn, nameAr: places.nameAr, descriptionEn: places.descriptionEn })
        .from(places)
        .where(or(ilike(places.nameEn, term), ilike(places.nameAr, term)))
        .limit(perKind),

      db.select({ id: experiences.id, slug: experiences.slug, titleEn: experiences.titleEn, titleAr: experiences.titleAr, summaryEn: experiences.summaryEn })
        .from(experiences)
        .where(and(eq(experiences.status, 'published'), or(ilike(experiences.titleEn, term), ilike(experiences.titleAr, term))))
        .limit(perKind),
    ]);

    const results: SearchResult[] = [
      ...ppl.map((p) => ({
        kind: 'person' as const,
        id: p.id,
        slug: p.id,
        titleEn: `${p.firstNameEn} ${p.lastNameEn}`,
        titleAr: p.firstNameAr ? `${p.firstNameAr} ${p.lastNameAr ?? ''}`.trim() : null,
        snippet: p.bioEn?.slice(0, 100) ?? null,
      })),
      ...art.map((a) => ({ kind: 'article' as const, id: a.id, slug: a.slugEn ?? '', titleEn: a.titleEn, titleAr: a.titleAr, snippet: a.excerptEn?.slice(0, 100) ?? null })),
      ...pil.map((p) => ({ kind: 'pillar' as const, id: p.id, slug: p.slug, titleEn: p.nameEn, titleAr: p.nameAr, snippet: p.descriptionEn?.slice(0, 100) ?? null })),
      ...plc.map((p) => ({ kind: 'place' as const, id: p.id, slug: p.slug, titleEn: p.nameEn, titleAr: p.nameAr, snippet: p.descriptionEn?.slice(0, 100) ?? null })),
      ...exp.map((e) => ({ kind: 'experience' as const, id: e.id, slug: e.slug, titleEn: e.titleEn, titleAr: e.titleAr, snippet: e.summaryEn?.slice(0, 100) ?? null })),
    ];

    return results.slice(0, limit);
  }
}
