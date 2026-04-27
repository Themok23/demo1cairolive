import { auth } from '@/src/lib/auth';
import { db } from '@/src/infrastructure/db/client';
import { persons } from '@/src/infrastructure/db/schema';
import { eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import PersonSubResourceTabs from '@/components/admin/person-sub-resource-tabs';

interface EditPersonPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditPersonPage({ params }: EditPersonPageProps) {
  const session = await auth();
  if (!session) redirect('/en/admin/login');

  const { id } = await params;
  const person = await db
    .select()
    .from(persons)
    .where(eq(persons.id, id))
    .then((result) => result[0]);

  if (!person) notFound();

  const personData = {
    ...person,
    dateOfBirth: person.dateOfBirth ? new Date(person.dateOfBirth) : null,
  };

  return <PersonSubResourceTabs personId={id} initialData={personData as any} />;
}
