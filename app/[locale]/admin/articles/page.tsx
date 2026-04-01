import { db } from '@/src/infrastructure/db/client';
import { articles } from '@/src/infrastructure/db/schema';
import { desc } from 'drizzle-orm';
import AdminArticlesList from '@/components/admin/articles-list';

interface AdminArticlesPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function AdminArticlesPage({ params }: AdminArticlesPageProps) {
  const { locale } = await params;
  const allArticles = await db
    .select()
    .from(articles)
    .orderBy(desc(articles.createdAt))
    .limit(200);

  return <AdminArticlesList articles={allArticles} locale={locale} />;
}
