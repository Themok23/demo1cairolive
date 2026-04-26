import { auth } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import PillarForm from '@/components/admin/pillar-form';

export default async function NewPillarPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');
  return <PillarForm />;
}
