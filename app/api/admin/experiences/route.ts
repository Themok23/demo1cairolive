import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/src/lib/auth';
import { DrizzleExperienceRepository } from '@/src/infrastructure/repositories/drizzleExperienceRepository';
import { ListPendingExperiencesUseCase } from '@/src/application/use-cases/experiences/listPendingExperiences';

const repo = () => new DrizzleExperienceRepository();

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const status = (new URL(req.url).searchParams.get('status') ?? 'pending') as 'pending' | 'published' | 'rejected';
  const data = await repo().listByStatus(status);
  return NextResponse.json({ success: true, data });
}
