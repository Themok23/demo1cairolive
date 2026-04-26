import { auth } from '@/src/lib/auth';
import { redirect, notFound } from 'next/navigation';
import PillarForm from '@/components/admin/pillar-form';
import { db } from '@/src/infrastructure/db/client';
import { pillars } from '@/src/infrastructure/db/schema';
import { eq } from 'drizzle-orm';

interface EditPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function EditPillarPage({ params }: EditPageProps) {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const { id } = await params;
  const result = await db.select().from(pillars).where(eq(pillars.id, id)).limit(1);
  if (result.length === 0) notFound();

  return <PillarForm initialData={result[0] as any} />;
}
