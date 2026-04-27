import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/src/lib/auth';
import { DrizzleExperienceRepository } from '@/src/infrastructure/repositories/drizzleExperienceRepository';
import { ApproveExperienceUseCase } from '@/src/application/use-cases/experiences/approveExperience';
import { RejectExperienceUseCase } from '@/src/application/use-cases/experiences/rejectExperience';

const repo = () => new DrizzleExperienceRepository();

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body?.action) return NextResponse.json({ error: 'Missing action' }, { status: 400 });
  if (body.action === 'approve') {
    const result = await new ApproveExperienceUseCase(repo()).execute(id);
    return NextResponse.json(result);
  }
  if (body.action === 'reject') {
    const result = await new RejectExperienceUseCase(repo()).execute(id, { rejectionReason: body.rejectionReason });
    return NextResponse.json(result);
  }
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
