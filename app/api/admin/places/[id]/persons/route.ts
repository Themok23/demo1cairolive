import { auth } from '@/src/lib/auth';
import { db } from '@/src/infrastructure/db/client';
import { placePersons, persons } from '@/src/infrastructure/db/schema';
import { and, asc, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const linkSchema = z.object({
  personId: z.string().min(1),
  role: z.string().min(1).max(50),
  roleEn: z.string().max(100).optional(),
  roleAr: z.string().max(100).optional(),
  displayOrder: z.coerce.number().int().min(0).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const data = await db
      .select({
        placeId: placePersons.placeId,
        personId: placePersons.personId,
        role: placePersons.role,
        roleEn: placePersons.roleEn,
        roleAr: placePersons.roleAr,
        displayOrder: placePersons.displayOrder,
        firstNameEn: persons.firstNameEn,
        firstNameAr: persons.firstNameAr,
        lastNameEn: persons.lastNameEn,
        lastNameAr: persons.lastNameAr,
        profileImageUrl: persons.profileImageUrl,
      })
      .from(placePersons)
      .innerJoin(persons, eq(placePersons.personId, persons.id))
      .where(eq(placePersons.placeId, id))
      .orderBy(asc(placePersons.displayOrder));

    return NextResponse.json(data);
  } catch {

    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = linkSchema.safeParse(await request.json());
    if (!body.success) {
      return NextResponse.json(
        { error: body.error.errors.map((e) => e.message).join(', ') },
        { status: 422 }
      );
    }
    const v = body.data;

    await db
      .insert(placePersons)
      .values({
        placeId: id,
        personId: v.personId,
        role: v.role,
        roleEn: v.roleEn ?? null,
        roleAr: v.roleAr ?? null,
        displayOrder: v.displayOrder ?? 0,
        createdAt: new Date(),
      })
      .onConflictDoNothing();

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {

    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const personId = request.nextUrl.searchParams.get('personId');
    const role = request.nextUrl.searchParams.get('role');
    if (!personId || !role) {
      return NextResponse.json({ error: 'personId and role required' }, { status: 422 });
    }

    const result = await db
      .delete(placePersons)
      .where(
        and(
          eq(placePersons.placeId, id),
          eq(placePersons.personId, personId),
          eq(placePersons.role, role)
        )
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch {

    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
