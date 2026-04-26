import { auth } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import PlaceForm from '@/components/admin/place-form';
import { db } from '@/src/infrastructure/db/client';
import { pillars } from '@/src/infrastructure/db/schema';
import { asc, eq } from 'drizzle-orm';

export default async function NewPlacePage() {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const allPillars = await db
    .select({ id: pillars.id, slug: pillars.slug, nameEn: pillars.nameEn })
    .from(pillars)
    .where(eq(pillars.isActive, true))
    .orderBy(asc(pillars.displayOrder), asc(pillars.nameEn));

  return <PlaceForm pillars={allPillars} />;
}
