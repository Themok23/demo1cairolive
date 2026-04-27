import { auth } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/src/infrastructure/db/client';
import { persons, places } from '@/src/infrastructure/db/schema';
import { asc, eq } from 'drizzle-orm';
import ArticleForm from '@/components/admin/article-form';

interface NewArticlePageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminNewArticlePage({ params }: NewArticlePageProps) {
  const session = await auth();
  const { locale } = await params;
  if (!session) redirect(`/${locale}/admin/login`);

  const [allPersons, allPlaces] = await Promise.all([
    db.select().from(persons),
    db
      .select({ id: places.id, slug: places.slug, nameEn: places.nameEn })
      .from(places)
      .where(eq(places.status, 'published'))
      .orderBy(asc(places.nameEn)),
  ]);

  return <ArticleForm locale={locale} people={allPersons} places={allPlaces} />;
}
