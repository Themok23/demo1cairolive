import { auth } from '@/src/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { db } from '@/src/infrastructure/db/client';
import { articles, persons, places } from '@/src/infrastructure/db/schema';
import { asc, eq } from 'drizzle-orm';
import ArticleForm from '@/components/admin/article-form';

interface EditArticlePageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function AdminEditArticlePage({ params }: EditArticlePageProps) {
  const session = await auth();
  const { id, locale } = await params;
  if (!session) redirect(`/${locale}/admin/login`);

  const [article, allPersons, allPlaces] = await Promise.all([
    db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
      .then((result) => result[0]),
    db.select().from(persons),
    db
      .select({ id: places.id, slug: places.slug, nameEn: places.nameEn })
      .from(places)
      .where(eq(places.status, 'published'))
      .orderBy(asc(places.nameEn)),
  ]);

  if (!article) notFound();

  return <ArticleForm locale={locale} initialData={article as any} people={allPersons} places={allPlaces} />;
}
