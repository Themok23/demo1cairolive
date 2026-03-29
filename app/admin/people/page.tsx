import { db } from '@/src/infrastructure/db/client';
import { persons } from '@/src/infrastructure/db/schema';
import { desc } from 'drizzle-orm';
import AdminPeopleList from '@/components/admin/people-list';

export default async function AdminPeoplePage() {
  const allPersons = await db
    .select()
    .from(persons)
    .orderBy(desc(persons.createdAt));

  return <AdminPeopleList people={allPersons} />;
}
