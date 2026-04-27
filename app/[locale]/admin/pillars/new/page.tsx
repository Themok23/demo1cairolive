import { auth } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import PillarForm from '@/components/admin/pillar-form';

interface NewPillarPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewPillarPage({ params }: NewPillarPageProps) {
  const session = await auth();
  const { locale } = await params;
  if (!session) redirect(`/${locale}/admin/login`);
  return <PillarForm locale={locale} />;
}
