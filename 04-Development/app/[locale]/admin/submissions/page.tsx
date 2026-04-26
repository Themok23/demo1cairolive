import { db } from '@/src/infrastructure/db/client';
import { submissions } from '@/src/infrastructure/db/schema';
import { desc } from 'drizzle-orm';
import AdminSubmissionsList from '@/components/admin/submissions-list';

export default async function AdminSubmissionsPage() {
  const allSubmissions = await db
    .select()
    .from(submissions)
    .orderBy(desc(submissions.submittedAt))
    .limit(200);

  return <AdminSubmissionsList submissions={allSubmissions} />;
}
