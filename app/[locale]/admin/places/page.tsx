import { auth } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import AdminPlacesList from '@/components/admin/places-list';
import { db } from '@/src/infrastructure/db/client';
import { places, pillars } from '@/src/infrastructure/db/schema';
import { desc, eq } from 'drizzle-orm';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminPlacesPage({ params }: PageProps) {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const { locale } = await params;
  const data = await db
    .select({
      id: places.id,
      slug: places.slug,
      pillarSlug: pillars.slug,
      pillarNameEn: pillars.nameEn,
      type: places.type,
      nameEn: places.nameEn,
      nameAr: places.nameAr,
      coverImageUrl: places.coverImageUrl,
      isFeatured: places.isFeatured,
      status: places.status,
    })
    .from(places)
    .innerJoin(pillars, eq(places.pillarId, pillars.id))
    .orderBy(desc(places.createdAt));

  return <AdminPlacesList places={data as any} locale={locale} />;
}
