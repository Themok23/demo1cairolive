import { auth } from '@/src/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { DrizzlePersonServiceRepository } from '@/src/infrastructure/repositories/drizzlePersonServiceRepository';
import { UpdatePersonServiceUseCase } from '@/src/application/use-cases/person-services/update';
import { DeletePersonServiceUseCase } from '@/src/application/use-cases/person-services/delete';

type Ctx = { params: Promise<{ personId: string; id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const repo = new DrizzlePersonServiceRepository();
  const result = await new UpdatePersonServiceUseCase(repo).execute(id, body);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 422 });
  return NextResponse.json({ data: result.data });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const repo = new DrizzlePersonServiceRepository();
  const result = await new DeletePersonServiceUseCase(repo).execute(id);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 422 });
  return NextResponse.json({ success: true });
}
