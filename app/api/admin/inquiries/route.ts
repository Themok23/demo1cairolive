import { auth } from '@/src/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { DrizzleKrtkInquiryRepository } from '@/src/infrastructure/repositories/drizzleKrtkInquiryRepository';
import { ListInquiriesUseCase } from '@/src/application/use-cases/krtk-inquiries/listInquiries';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sp = req.nextUrl.searchParams;
  const limit = Math.min(parseInt(sp.get('limit') ?? '50', 10), 200);
  const offset = parseInt(sp.get('offset') ?? '0', 10);

  const repo = new DrizzleKrtkInquiryRepository();
  const result = await new ListInquiriesUseCase(repo).execute(limit, offset);

  if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ data: result.data, total: result.total });
}
