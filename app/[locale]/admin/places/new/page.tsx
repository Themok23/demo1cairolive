import { auth } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import PlaceForm from '@/components/admin/place-form';
import { db } from '@/src/infrastructure/db/client';
import { pillars } from '@/src/infrastructure/db/schema';
import { asc, eq } from 'drizzle-orm';

interface NewPlacePageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewPlacePage({ params }: NewPlacePageProps) {
  const session = await auth();
  const { locale } = await params;
  if (!session) redirect(`/${locale}/admin/login`);

  const allPillars = await db
    .select({ id: pillars.id, slug: pillars.slug, nameEn: pillars.nameEn })
    .from(pillars)
    .where(eq(pillars.isActive, true))
    .orderBy(asc(pillars.displayOrder), asc(pillars.nameEn));

  return <PlaceForm locale={locale} pillars={allPillars} />;
}
