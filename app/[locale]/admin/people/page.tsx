import { db } from '@/src/infrastructure/db/client';
import { persons } from '@/src/infrastructure/db/schema';
import { desc } from 'drizzle-orm';
import AdminPeopleList from '@/components/admin/people-list';

interface AdminPeoplePageProps {
  params: {
    locale: string;
  };
}

export default async function AdminPeoplePage({ params }: AdminPeoplePageProps) {
  const allPersons = await db
    .select()
    .from(persons)
    .orderBy(desc(persons.createdAt));

  return <AdminPeopleList people={allPersons} locale={params.locale} />;
}
