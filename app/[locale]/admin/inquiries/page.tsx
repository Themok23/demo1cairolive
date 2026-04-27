import { auth } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import { DrizzleKrtkInquiryRepository } from '@/src/infrastructure/repositories/drizzleKrtkInquiryRepository';
import { ListInquiriesUseCase } from '@/src/application/use-cases/krtk-inquiries/listInquiries';
import AdminInquiriesList from '@/components/admin/inquiries-list';

export default async function AdminInquiriesPage() {
  const session = await auth();
  if (!session) redirect('/en/admin/login');

  const repo = new DrizzleKrtkInquiryRepository();
  const result = await new ListInquiriesUseCase(repo).execute(100, 0);
  const inquiries = result.data ?? [];
  const total = result.total ?? 0;

  return <AdminInquiriesList inquiries={inquiries} total={total} />;
}
