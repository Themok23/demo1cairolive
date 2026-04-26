import { db } from '@/src/infrastructure/db/client';
import { persons, places } from '@/src/infrastructure/db/schema';
import { asc, eq } from 'drizzle-orm';
import ArticleForm from '@/components/admin/article-form';

export default async function AdminNewArticlePage() {
  const [allPersons, allPlaces] = await Promise.all([
    db.select().from(persons),
    db
      .select({ id: places.id, slug: places.slug, nameEn: places.nameEn })
      .from(places)
      .where(eq(places.status, 'published'))
      .orderBy(asc(places.nameEn)),
  ]);

  return <ArticleForm people={allPersons} places={allPlaces} />;
}
