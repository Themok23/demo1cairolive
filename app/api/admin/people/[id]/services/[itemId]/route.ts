import { auth } from '@/src/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { DrizzlePersonServiceRepository } from '@/src/infrastructure/repositories/drizzlePersonServiceRepository';
import { UpdatePersonServiceUseCase } from '@/src/application/use-cases/person-services/update';
import { DeletePersonServiceUseCase } from '@/src/application/use-cases/person-services/delete';

type Ctx = { params: Promise<{ id: string; itemId: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { itemId } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  const repo = new DrizzlePersonServiceRepository();
  const result = await new UpdatePersonServiceUseCase(repo).execute(itemId, body);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 422 });
  return NextResponse.json({ data: result.data });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { itemId } = await params;
  const repo = new DrizzlePersonServiceRepository();
  const result = await new DeletePersonServiceUseCase(repo).execute(itemId);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 422 });
  return NextResponse.json({ success: true });
}
