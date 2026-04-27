import { auth } from '@/src/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { DrizzlePersonServiceRepository } from '@/src/infrastructure/repositories/drizzlePersonServiceRepository';
import { ListPersonServicesUseCase } from '@/src/application/use-cases/person-services/listByPerson';
import { CreatePersonServiceUseCase } from '@/src/application/use-cases/person-services/create';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id: personId } = await params;
  const repo = new DrizzlePersonServiceRepository();
  const result = await new ListPersonServicesUseCase(repo).execute(personId);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ data: result.data });
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id: personId } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  const repo = new DrizzlePersonServiceRepository();
  const result = await new CreatePersonServiceUseCase(repo).execute({ ...body, personId });
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 422 });
  return NextResponse.json({ data: result.data }, { status: 201 });
}
