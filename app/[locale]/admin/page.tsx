import { db } from '@/src/infrastructure/db/client';
import { persons, articles, submissions, subscribers } from '@/src/infrastructure/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import AdminDashboard from '@/components/admin/dashboard';

interface AdminPageProps {
  params: {
    locale: string;
  };
}

export default async function AdminPage({ params }: AdminPageProps) {
  // Fetch all counts
  const [personCount, articleCount, submissionCount, subscriberCount, recentSubmissions] =
    await Promise.all([
      db.select({ count: sql<number>`cast(count(*) as integer)` }).from(persons),
      db.select({ count: sql<number>`cast(count(*) as integer)` }).from(articles),
      db.select({ count: sql<number>`cast(count(*) as integer)` }).from(submissions),
      db.select({ count: sql<number>`cast(count(*) as integer)` }).from(subscribers),
      db
        .select()
        .from(submissions)
        .orderBy(desc(submissions.submittedAt))
        .limit(5),
    ]);

  const stats = {
    totalPeople: personCount[0]?.count || 0,
    totalArticles: articleCount[0]?.count || 0,
    totalSubmissions: submissionCount[0]?.count || 0,
    totalSubscribers: subscriberCount[0]?.count || 0,
  };

  return <AdminDashboard stats={stats} recentSubmissions={recentSubmissions} locale={params.locale} />;
}
