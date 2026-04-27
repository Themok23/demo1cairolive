import { auth } from '@/src/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { DrizzlePersonWorkplaceRepository } from '@/src/infrastructure/repositories/drizzlePersonWorkplaceRepository';
import { UpdatePersonWorkplaceUseCase } from '@/src/application/use-cases/person-workplaces/update';
import { DeletePersonWorkplaceUseCase } from '@/src/application/use-cases/person-workplaces/delete';

type Ctx = { params: Promise<{ id: string; itemId: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { itemId } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  const repo = new DrizzlePersonWorkplaceRepository();
  const result = await new UpdatePersonWorkplaceUseCase(repo).execute(itemId, body);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 422 });
  return NextResponse.json({ data: result.data });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { itemId } = await params;
  const repo = new DrizzlePersonWorkplaceRepository();
  const result = await new DeletePersonWorkplaceUseCase(repo).execute(itemId);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 422 });
  return NextResponse.json({ success: true });
}
