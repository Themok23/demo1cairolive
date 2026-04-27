import { auth } from '@/src/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { DrizzlePersonAchievementRepository } from '@/src/infrastructure/repositories/drizzlePersonAchievementRepository';
import { UpdatePersonAchievementUseCase } from '@/src/application/use-cases/person-achievements/update';
import { DeletePersonAchievementUseCase } from '@/src/application/use-cases/person-achievements/delete';

type Ctx = { params: Promise<{ personId: string; id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const repo = new DrizzlePersonAchievementRepository();
  const result = await new UpdatePersonAchievementUseCase(repo).execute(id, body);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 422 });
  return NextResponse.json({ data: result.data });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const repo = new DrizzlePersonAchievementRepository();
  const result = await new DeletePersonAchievementUseCase(repo).execute(id);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 422 });
  return NextResponse.json({ success: true });
}
