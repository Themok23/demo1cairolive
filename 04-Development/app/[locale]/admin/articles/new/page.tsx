import { db } from '@/src/infrastructure/db/client';
import { persons } from '@/src/infrastructure/db/schema';
import ArticleForm from '@/components/admin/article-form';

export default async function AdminNewArticlePage() {
  const allPersons = await db.select().from(persons);

  return <ArticleForm people={allPersons} />;
}
