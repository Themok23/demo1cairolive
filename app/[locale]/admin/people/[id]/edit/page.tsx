import { db } from '@/src/infrastructure/db/client';
import { persons } from '@/src/infrastructure/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PersonSubResourceTabs from '@/components/admin/person-sub-resource-tabs';

interface EditPersonPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function AdminEditPersonPage({ params }: EditPersonPageProps) {
  const { locale, id } = await params;
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

  return (
    <div>
      <div className="flex justify-end px-4 pt-4">
        <Link
          href={`/${locale}/admin/people/${id}/analytics` as any}
          className="text-xs text-text-secondary hover:text-gold transition-colors border border-border/40 rounded-lg px-3 py-1.5"
        >
          View Analytics
        </Link>
      </div>
      <PersonSubResourceTabs personId={id} initialData={personData as any} />
    </div>
  );
}
