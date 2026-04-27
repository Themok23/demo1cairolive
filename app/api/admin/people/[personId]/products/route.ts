import { auth } from '@/src/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { DrizzlePersonProductRepository } from '@/src/infrastructure/repositories/drizzlePersonProductRepository';
import { ListPersonProductsUseCase } from '@/src/application/use-cases/person-products/listByPerson';
import { CreatePersonProductUseCase } from '@/src/application/use-cases/person-products/create';

type Ctx = { params: Promise<{ personId: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { personId } = await params;
  const repo = new DrizzlePersonProductRepository();
  const result = await new ListPersonProductsUseCase(repo).execute(personId);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ data: result.data });
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { personId } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  const repo = new DrizzlePersonProductRepository();
  const result = await new CreatePersonProductUseCase(repo).execute({ ...body, personId });
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 422 });
  return NextResponse.json({ data: result.data }, { status: 201 });
}
