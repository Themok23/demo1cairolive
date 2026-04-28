import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/src/lib/auth';
import { DrizzleExperienceRepository } from '@/src/infrastructure/repositories/drizzleExperienceRepository';
import type { ExperienceStatus } from '@/src/domain/entities/experience';

const VALID_STATUSES: ExperienceStatus[] = ['pending', 'published', 'rejected'];
const repo = () => new DrizzleExperienceRepository();

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const rawStatus = new URL(req.url).searchParams.get('status') ?? 'pending';
  if (!VALID_STATUSES.includes(rawStatus as ExperienceStatus))
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  const data = await repo().listByStatus(rawStatus as ExperienceStatus, { limit: 100 });
  return NextResponse.json({ success: true, data });
}
