import { auth } from '@/src/lib/auth';
import { db } from '@/src/infrastructure/db/client';
import { places, placePersons } from '@/src/infrastructure/db/schema';
import { and, eq, ne } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const optionalText = z
  .string()
  .transform((v) => (v === '' ? null : v))
  .pipe(z.string().nullable());

const updatePlaceSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  pillarId: z.string().min(1).optional(),
  type: z.enum(['restaurant', 'museum', 'landmark', 'cafe', 'shop', 'gallery', 'hotel']).optional(),
  nameEn: z.string().min(1).max(200).optional(),
  nameAr: optionalText.optional(),
  taglineEn: optionalText.optional(),
  taglineAr: optionalText.optional(),
  descriptionEn: optionalText.optional(),
  descriptionAr: optionalText.optional(),
  locationEn: optionalText.optional(),
  locationAr: optionalText.optional(),
  mapUrl: optionalText.optional(),
  latitude: z.union([z.string(), z.number()]).nullable().optional(),
  longitude: z.union([z.string(), z.number()]).nullable().optional(),
  phone: optionalText.optional(),
  email: optionalText.optional(),
  websiteUrl: optionalText.optional(),
  instagramUrl: optionalText.optional(),
  openingHoursJson: optionalText.optional(),
  coverImageUrl: optionalText.optional(),
  galleryImagesJson: optionalText.optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const result = await db.select().from(places).where(eq(places.id, id)).limit(1);
    if (result.length === 0) return NextResponse.json({ error: 'Place not found' }, { status: 404 });
    return NextResponse.json(result[0]);
  } catch {

    return NextResponse.json({ error: 'Failed to fetch place' }, { status: 500 });
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
    const body = updatePlaceSchema.safeParse(await request.json());
    if (!body.success) {
      return NextResponse.json(
        { error: body.error.errors.map((e) => e.message).join(', ') },
        { status: 422 }
      );
    }
    const v = body.data;

    if (v.slug) {
      const existing = await db
        .select({ id: places.id })
        .from(places)
        .where(and(eq(places.slug, v.slug), ne(places.id, id)))
        .limit(1);
      if (existing.length > 0) {
        return NextResponse.json(
          { error: `Slug "${v.slug}" is already in use` },
          { status: 409 }
        );
      }
    }

    const updates: any = { updatedAt: new Date() };
    for (const k of Object.keys(v) as (keyof typeof v)[]) {
      if (v[k] !== undefined) {
        if (k === 'latitude' || k === 'longitude') {
          updates[k] = v[k] !== null ? String(v[k]) : null;
        } else {
          updates[k] = v[k];
        }
      }
    }

    const result = await db.update(places).set(updates).where(eq(places.id, id)).returning();
    if (result.length === 0) return NextResponse.json({ error: 'Place not found' }, { status: 404 });
    return NextResponse.json(result[0]);
  } catch {

    return NextResponse.json({ error: 'Failed to update place' }, { status: 500 });
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
    // Cascade-delete the M2M links first.
    await db.delete(placePersons).where(eq(placePersons.placeId, id));
    const result = await db.delete(places).where(eq(places.id, id)).returning();
    if (result.length === 0) return NextResponse.json({ error: 'Place not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {

    return NextResponse.json({ error: 'Failed to delete place' }, { status: 500 });
  }
}
