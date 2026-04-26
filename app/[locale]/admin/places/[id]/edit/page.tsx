import { auth } from '@/src/lib/auth';
import { redirect, notFound } from 'next/navigation';
import PlaceForm from '@/components/admin/place-form';
import { db } from '@/src/infrastructure/db/client';
import { places, pillars } from '@/src/infrastructure/db/schema';
import { asc, eq } from 'drizzle-orm';

interface EditPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function EditPlacePage({ params }: EditPageProps) {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const { id } = await params;
  const result = await db.select().from(places).where(eq(places.id, id)).limit(1);
  if (result.length === 0) notFound();

  const allPillars = await db
    .select({ id: pillars.id, slug: pillars.slug, nameEn: pillars.nameEn })
    .from(pillars)
    .where(eq(pillars.isActive, true))
    .orderBy(asc(pillars.displayOrder), asc(pillars.nameEn));

  return <PlaceForm pillars={allPillars} initialData={result[0] as any} />;
}
