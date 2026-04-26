import { auth } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import AdminPillarsList from '@/components/admin/pillars-list';
import { db } from '@/src/infrastructure/db/client';
import { pillars } from '@/src/infrastructure/db/schema';
import { asc } from 'drizzle-orm';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminPillarsPage({ params }: PageProps) {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const { locale } = await params;
  const allPillars = await db
    .select()
    .from(pillars)
    .orderBy(asc(pillars.displayOrder), asc(pillars.nameEn));

  return <AdminPillarsList pillars={allPillars as any} locale={locale} />;
}
