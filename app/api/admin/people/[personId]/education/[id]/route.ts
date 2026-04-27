import { auth } from '@/src/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { DrizzlePersonEducationRepository } from '@/src/infrastructure/repositories/drizzlePersonEducationRepository';
import { UpdatePersonEducationUseCase } from '@/src/application/use-cases/person-education/update';
import { DeletePersonEducationUseCase } from '@/src/application/use-cases/person-education/delete';

type Ctx = { params: Promise<{ personId: string; id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const repo = new DrizzlePersonEducationRepository();
  const result = await new UpdatePersonEducationUseCase(repo).execute(id, body);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 422 });
  return NextResponse.json({ data: result.data });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const repo = new DrizzlePersonEducationRepository();
  const result = await new DeletePersonEducationUseCase(repo).execute(id);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 422 });
  return NextResponse.json({ success: true });
}
