import { db } from '@/src/infrastructure/db/client';
import { articles, persons } from '@/src/infrastructure/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import ArticleForm from '@/components/admin/article-form';

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const [article, allPersons] = await Promise.all([
    db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
      .then((result) => result[0]),
    db.select().from(persons),
  ]);

  if (!article) {
    notFound();
  }

  return <ArticleForm initialData={article} people={allPersons} />;
}
