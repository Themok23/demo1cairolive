import { NextRequest, NextResponse } from 'next/server';
import { DrizzleExperienceRepository } from '@/src/infrastructure/repositories/drizzleExperienceRepository';
import { ReactToExperienceUseCase } from '@/src/application/use-cases/experiences/reactToExperience';
import { createHash } from 'crypto';

function buildUserIdentifier(req: NextRequest): string {
  const ip = req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim() ?? 'unknown';
  return createHash('sha256').update(ip).digest('hex').slice(0, 32);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  const userIdentifier = buildUserIdentifier(req);
  const result = await new ReactToExperienceUseCase(new DrizzleExperienceRepository()).execute(id, { ...body, userIdentifier });
  return NextResponse.json(result);
}
