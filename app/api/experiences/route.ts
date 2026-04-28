import { NextRequest, NextResponse } from 'next/server';
import { DrizzleExperienceRepository } from '@/src/infrastructure/repositories/drizzleExperienceRepository';
import { ListPublishedExperiencesUseCase } from '@/src/application/use-cases/experiences/listPublishedExperiences';
import { SubmitExperienceUseCase } from '@/src/application/use-cases/experiences/submitExperience';
import { checkRateLimit } from '@/src/lib/rateLimit';

const repo = () => new DrizzleExperienceRepository();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const result = await new ListPublishedExperiencesUseCase(repo()).execute({
    pillarId: searchParams.get('pillarId') ?? undefined,
    type: searchParams.get('type') ?? undefined,
    limit: Number(searchParams.get('limit') ?? 20),
    offset: Number(searchParams.get('offset') ?? 0),
  });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim() ?? 'unknown';
  if (!checkRateLimit(`exp-submit:${ip}`, 3, 3_600_000))
    return NextResponse.json({ success: false, error: 'Too many submissions. Try again later.' }, { status: 429 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  const result = await new SubmitExperienceUseCase(repo()).execute(body);
  return NextResponse.json(result, { status: result.success ? 201 : 400 });
}
