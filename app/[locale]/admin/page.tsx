import { db } from '@/src/infrastructure/db/client';
import { persons, articles, submissions, subscribers, experiences, krtkInquiries } from '@/src/infrastructure/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import AdminDashboard from '@/components/admin/dashboard';

interface AdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;

  const [
    personCount,
    articleCount,
    submissionCount,
    pendingSubmissionCount,
    subscriberCount,
    experienceCount,
    inquiryCount,
    recentSubmissions,
  ] = await Promise.all([
    db.select({ count: sql<number>`cast(count(*) as integer)` }).from(persons),
    db.select({ count: sql<number>`cast(count(*) as integer)` }).from(articles).where(eq(articles.status, 'published')),
    db.select({ count: sql<number>`cast(count(*) as integer)` }).from(submissions),
    db.select({ count: sql<number>`cast(count(*) as integer)` }).from(submissions).where(eq(submissions.status, 'pending')),
    db.select({ count: sql<number>`cast(count(*) as integer)` }).from(subscribers).where(eq(subscribers.isActive, true)),
    db.select({ count: sql<number>`cast(count(*) as integer)` }).from(experiences).where(eq(experiences.status, 'published')),
    db.select({ count: sql<number>`cast(count(*) as integer)` }).from(krtkInquiries),
    db.select().from(submissions).orderBy(desc(submissions.submittedAt)).limit(6),
  ]);

  return (
    <AdminDashboard
      stats={{
        totalPeople: personCount[0]?.count ?? 0,
        totalArticles: articleCount[0]?.count ?? 0,
        totalSubmissions: submissionCount[0]?.count ?? 0,
        pendingSubmissions: pendingSubmissionCount[0]?.count ?? 0,
        totalSubscribers: subscriberCount[0]?.count ?? 0,
        totalExperiences: experienceCount[0]?.count ?? 0,
        totalInquiries: inquiryCount[0]?.count ?? 0,
      }}
      recentSubmissions={recentSubmissions}
      locale={locale}
    />
  );
}
