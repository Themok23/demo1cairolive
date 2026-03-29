import { db } from '@/src/infrastructure/db/client';
import { articles } from '@/src/infrastructure/db/schema';
import { desc } from 'drizzle-orm';
import AdminArticlesList from '@/components/admin/articles-list';

export default async function AdminArticlesPage() {
  const allArticles = await db
    .select()
    .from(articles)
    .orderBy(desc(articles.createdAt));

  return <AdminArticlesList articles={allArticles} />;
}
