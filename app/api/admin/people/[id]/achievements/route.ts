import { auth } from '@/src/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { DrizzlePersonAchievementRepository } from '@/src/infrastructure/repositories/drizzlePersonAchievementRepository';
import { ListPersonAchievementsUseCase } from '@/src/application/use-cases/person-achievements/listByPerson';
import { CreatePersonAchievementUseCase } from '@/src/application/use-cases/person-achievements/create';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id: personId } = await params;
  const repo = new DrizzlePersonAchievementRepository();
  const result = await new ListPersonAchievementsUseCase(repo).execute(personId);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ data: result.data });
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id: personId } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  const repo = new DrizzlePersonAchievementRepository();
  const result = await new CreatePersonAchievementUseCase(repo).execute({ ...body, personId });
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 422 });
  return NextResponse.json({ data: result.data }, { status: 201 });
}
