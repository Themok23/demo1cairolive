import { auth } from '@/src/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { DrizzlePersonEducationRepository } from '@/src/infrastructure/repositories/drizzlePersonEducationRepository';
import { ListPersonEducationUseCase } from '@/src/application/use-cases/person-education/listByPerson';
import { CreatePersonEducationUseCase } from '@/src/application/use-cases/person-education/create';

type Ctx = { params: Promise<{ personId: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { personId } = await params;
  const repo = new DrizzlePersonEducationRepository();
  const result = await new ListPersonEducationUseCase(repo).execute(personId);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ data: result.data });
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { personId } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  const repo = new DrizzlePersonEducationRepository();
  const result = await new CreatePersonEducationUseCase(repo).execute({ ...body, personId });
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 422 });
  return NextResponse.json({ data: result.data }, { status: 201 });
}
