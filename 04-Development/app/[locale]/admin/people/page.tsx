import { db } from '@/src/infrastructure/db/client';
import { persons } from '@/src/infrastructure/db/schema';
import { desc } from 'drizzle-orm';
import AdminPeopleList from '@/components/admin/people-list';

interface AdminPeoplePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function AdminPeoplePage({ params }: AdminPeoplePageProps) {
  const { locale } = await params;
  const allPersons = await db
    .select()
    .from(persons)
    .orderBy(desc(persons.createdAt))
    .limit(200);

  return <AdminPeopleList people={allPersons} locale={locale} />;
}
