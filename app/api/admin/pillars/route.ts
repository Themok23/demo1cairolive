import { auth } from '@/src/lib/auth';
import { db } from '@/src/infrastructure/db/client';
import { pillars } from '@/src/infrastructure/db/schema';
import { asc, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const optionalText = z
  .string()
  .transform((v) => (v === '' ? null : v))
  .pipe(z.string().nullable());

const adminPillarSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  nameEn: z.string().min(1).max(100),
  nameAr: optionalText.optional(),
  descriptionEn: optionalText.optional(),
  descriptionAr: optionalText.optional(),
  iconKey: optionalText.optional(),
  coverImageUrl: optionalText.optional(),
  displayOrder: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 500);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const allPillars = await db
      .select()
      .from(pillars)
      .orderBy(asc(pillars.displayOrder), asc(pillars.nameEn))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(allPillars);
  } catch (error) {
    console.error('Error fetching pillars:', error);
    return NextResponse.json({ error: 'Failed to fetch pillars' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rawBody = await request.json();
    const validation = adminPillarSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors.map((e) => e.message).join(', ') },
        { status: 422 }
      );
    }
    const body = validation.data;

    const existing = await db
      .select({ id: pillars.id })
      .from(pillars)
      .where(eq(pillars.slug, body.slug))
      .limit(1);
    if (existing.length > 0) {
      return NextResponse.json(
        { error: `Slug "${body.slug}" is already in use` },
        { status: 409 }
      );
    }

    const pillarId = crypto.randomUUID();
    const pillar = {
      id: pillarId,
      slug: body.slug,
      nameEn: body.nameEn,
      nameAr: body.nameAr ?? null,
      descriptionEn: body.descriptionEn ?? null,
      descriptionAr: body.descriptionAr ?? null,
      iconKey: body.iconKey ?? null,
      coverImageUrl: body.coverImageUrl ?? null,
      displayOrder: body.displayOrder ?? 0,
      isActive: body.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(pillars).values(pillar);
    return NextResponse.json(pillar, { status: 201 });
  } catch (error) {
    console.error('Error creating pillar:', error);
    return NextResponse.json({ error: 'Failed to create pillar' }, { status: 500 });
  }
}
