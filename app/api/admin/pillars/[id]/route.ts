import { auth } from '@/src/lib/auth';
import { db } from '@/src/infrastructure/db/client';
import { pillars } from '@/src/infrastructure/db/schema';
import { and, eq, ne } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const optionalText = z
  .string()
  .transform((v) => (v === '' ? null : v))
  .pipe(z.string().nullable());

const updatePillarSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only')
    .optional(),
  nameEn: z.string().min(1).max(100).optional(),
  nameAr: optionalText.optional(),
  descriptionEn: optionalText.optional(),
  descriptionAr: optionalText.optional(),
  iconKey: optionalText.optional(),
  coverImageUrl: optionalText.optional(),
  displayOrder: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const result = await db.select().from(pillars).where(eq(pillars.id, id)).limit(1);
    if (result.length === 0) {
      return NextResponse.json({ error: 'Pillar not found' }, { status: 404 });
    }
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching pillar:', error);
    return NextResponse.json({ error: 'Failed to fetch pillar' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const rawBody = await request.json();
    const validation = updatePillarSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors.map((e) => e.message).join(', ') },
        { status: 422 }
      );
    }
    const body = validation.data;

    if (body.slug) {
      const existing = await db
        .select({ id: pillars.id })
        .from(pillars)
        .where(and(eq(pillars.slug, body.slug), ne(pillars.id, id)))
        .limit(1);
      if (existing.length > 0) {
        return NextResponse.json(
          { error: `Slug "${body.slug}" is already in use` },
          { status: 409 }
        );
      }
    }

    const updates: any = { updatedAt: new Date() };
    for (const k of Object.keys(body) as (keyof typeof body)[]) {
      if (body[k] !== undefined) updates[k] = body[k];
    }

    const result = await db
      .update(pillars)
      .set(updates)
      .where(eq(pillars.id, id))
      .returning();
    if (result.length === 0) {
      return NextResponse.json({ error: 'Pillar not found' }, { status: 404 });
    }
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating pillar:', error);
    return NextResponse.json({ error: 'Failed to update pillar' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const result = await db.delete(pillars).where(eq(pillars.id, id)).returning();
    if (result.length === 0) {
      return NextResponse.json({ error: 'Pillar not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error deleting pillar:', error);
    return NextResponse.json({ error: 'Failed to delete pillar' }, { status: 500 });
  }
}
