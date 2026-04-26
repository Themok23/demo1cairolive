import { auth } from '@/src/lib/auth';
import { db } from '@/src/infrastructure/db/client';
import { places, pillars } from '@/src/infrastructure/db/schema';
import { desc, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const optionalText = z
  .string()
  .transform((v) => (v === '' ? null : v))
  .pipe(z.string().nullable());

const adminPlaceSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  pillarId: z.string().min(1),
  type: z.enum(['restaurant', 'museum', 'landmark', 'cafe', 'shop', 'gallery', 'hotel']),
  nameEn: z.string().min(1).max(200),
  nameAr: optionalText.optional(),
  taglineEn: optionalText.optional(),
  taglineAr: optionalText.optional(),
  descriptionEn: optionalText.optional(),
  descriptionAr: optionalText.optional(),
  locationEn: optionalText.optional(),
  locationAr: optionalText.optional(),
  mapUrl: optionalText.optional(),
  latitude: z.union([z.string(), z.number()]).optional().nullable(),
  longitude: z.union([z.string(), z.number()]).optional().nullable(),
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

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const limit = Math.min(
      parseInt(request.nextUrl.searchParams.get('limit') || '100', 10),
      500
    );
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0', 10);

    const data = await db
      .select({
        id: places.id,
        slug: places.slug,
        pillarId: places.pillarId,
        pillarSlug: pillars.slug,
        pillarNameEn: pillars.nameEn,
        type: places.type,
        nameEn: places.nameEn,
        nameAr: places.nameAr,
        coverImageUrl: places.coverImageUrl,
        isFeatured: places.isFeatured,
        status: places.status,
        createdAt: places.createdAt,
      })
      .from(places)
      .innerJoin(pillars, eq(places.pillarId, pillars.id))
      .orderBy(desc(places.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching places:', error);
    return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = adminPlaceSchema.safeParse(await request.json());
    if (!body.success) {
      return NextResponse.json(
        { error: body.error.errors.map((e) => e.message).join(', ') },
        { status: 422 }
      );
    }
    const v = body.data;

    const existing = await db
      .select({ id: places.id })
      .from(places)
      .where(eq(places.slug, v.slug))
      .limit(1);
    if (existing.length > 0) {
      return NextResponse.json(
        { error: `Slug "${v.slug}" is already in use` },
        { status: 409 }
      );
    }

    const placeId = crypto.randomUUID();
    const place = {
      id: placeId,
      slug: v.slug,
      pillarId: v.pillarId,
      type: v.type,
      nameEn: v.nameEn,
      nameAr: v.nameAr ?? null,
      taglineEn: v.taglineEn ?? null,
      taglineAr: v.taglineAr ?? null,
      descriptionEn: v.descriptionEn ?? null,
      descriptionAr: v.descriptionAr ?? null,
      locationEn: v.locationEn ?? null,
      locationAr: v.locationAr ?? null,
      mapUrl: v.mapUrl ?? null,
      latitude: v.latitude !== null && v.latitude !== undefined ? String(v.latitude) : null,
      longitude: v.longitude !== null && v.longitude !== undefined ? String(v.longitude) : null,
      phone: v.phone ?? null,
      email: v.email ?? null,
      websiteUrl: v.websiteUrl ?? null,
      instagramUrl: v.instagramUrl ?? null,
      openingHoursJson: v.openingHoursJson ?? null,
      coverImageUrl: v.coverImageUrl ?? null,
      galleryImagesJson: v.galleryImagesJson ?? null,
      isFeatured: v.isFeatured ?? false,
      status: v.status ?? 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(places).values(place);
    return NextResponse.json(place, { status: 201 });
  } catch (error) {
    console.error('Error creating place:', error);
    return NextResponse.json({ error: 'Failed to create place' }, { status: 500 });
  }
}
