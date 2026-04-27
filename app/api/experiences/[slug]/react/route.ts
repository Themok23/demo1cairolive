import { NextRequest, NextResponse } from 'next/server';
import { DrizzleExperienceRepository } from '@/src/infrastructure/repositories/drizzleExperienceRepository';
import { ReactToExperienceUseCase } from '@/src/application/use-cases/experiences/reactToExperience';
import { createHash } from 'crypto';
import { checkRateLimit } from '@/src/lib/rateLimit';

function buildUserIdentifier(req: NextRequest): string {
  const ip = req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim() ?? 'unknown';
  return createHash('sha256').update(ip).digest('hex').slice(0, 32);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ip = req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim() ?? 'unknown';
  if (!checkRateLimit(`react:${ip}`, 60, 60_000))
    return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });

  const repo = new DrizzleExperienceRepository();
  const exp = await repo.findById(slug) ?? await repo.findBySlug(slug);
  if (!exp) return NextResponse.json({ success: false, error: 'Experience not found' }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  const userIdentifier = buildUserIdentifier(req);
  const result = await new ReactToExperienceUseCase(repo).execute(exp.id, { ...body, userIdentifier });
  return NextResponse.json(result);
}
