import { NextRequest, NextResponse } from 'next/server';
import { DrizzleExperienceRepository } from '@/src/infrastructure/repositories/drizzleExperienceRepository';
import { GetExperienceBySlugUseCase } from '@/src/application/use-cases/experiences/getExperienceBySlug';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await new GetExperienceBySlugUseCase(new DrizzleExperienceRepository()).execute(slug);
  return NextResponse.json(result, { status: result.success ? 200 : 404 });
}
