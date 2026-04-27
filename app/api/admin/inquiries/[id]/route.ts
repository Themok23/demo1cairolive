import { auth } from '@/src/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DrizzleKrtkInquiryRepository } from '@/src/infrastructure/repositories/drizzleKrtkInquiryRepository';
import { MarkInquiryReadUseCase } from '@/src/application/use-cases/krtk-inquiries/markInquiryRead';

const Schema = z.object({
  action: z.enum(['read', 'forwarded', 'archived']),
  forwardedTo: z.string().email().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 422 });

  const repo = new DrizzleKrtkInquiryRepository();
  let updated;

  if (parsed.data.action === 'read') {
    updated = await new MarkInquiryReadUseCase(repo).execute(id);
  } else if (parsed.data.action === 'forwarded') {
    if (!parsed.data.forwardedTo) return NextResponse.json({ error: 'forwardedTo required' }, { status: 422 });
    updated = await repo.markForwarded(id, parsed.data.forwardedTo);
    return NextResponse.json({ success: true, data: updated });
  } else {
    const data = await repo.markArchived(id);
    return NextResponse.json({ success: true, data });
  }

  if (!updated.success) return NextResponse.json({ error: updated.error }, { status: 500 });
  return NextResponse.json({ success: true, data: updated.data });
}
