import { db } from '@/src/infrastructure/db/client';
import { persons } from '@/src/infrastructure/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import PersonForm from '@/components/admin/person-form';

interface EditPersonPageProps {
  params: { id: string };
}

export default async function AdminEditPersonPage({ params }: EditPersonPageProps) {
  const person = await db
    .select()
    .from(persons)
    .where(eq(persons.id, params.id))
    .then((result) => result[0]);

  if (!person) {
    notFound();
  }

  // Convert dateOfBirth string to Date if needed
  const personData = {
    ...person,
    dateOfBirth: person.dateOfBirth
      ? new Date(person.dateOfBirth)
      : null,
  };

  return <PersonForm initialData={personData as any} />;
}
