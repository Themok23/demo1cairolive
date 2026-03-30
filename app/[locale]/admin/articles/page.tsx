import { db } from '@/src/infrastructure/db/client';
import { articles } from '@/src/infrastructure/db/schema';
import { desc } from 'drizzle-orm';
import AdminArticlesList from '@/components/admin/articles-list';

interface AdminArticlesPageProps {
  params: {
    locale: string;
  };
}

export default async function AdminArticlesPage({ params }: AdminArticlesPageProps) {
  const allArticles = await db
    .select()
    .from(articles)
    .orderBy(desc(articles.createdAt));

  return <AdminArticlesList articles={allArticles} locale={params.locale} />;
}
