import { auth } from '@/src/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { DrizzleKrtkInquiryRepository } from '@/src/infrastructure/repositories/drizzleKrtkInquiryRepository';
import { MarkInquiryReadUseCase } from '@/src/application/use-cases/krtk-inquiries/markInquiryRead';
import AdminInquiryDetail from '@/components/admin/inquiry-detail';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminInquiryDetailPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect('/en/admin/login');

  const { id } = await params;
  const repo = new DrizzleKrtkInquiryRepository();

  const inquiry = await repo.findById(id);
  if (!inquiry) notFound();

  if (inquiry.status === 'new') {
    await new MarkInquiryReadUseCase(repo).execute(id);
    inquiry.status = 'read';
  }

  return <AdminInquiryDetail inquiry={inquiry} />;
}
