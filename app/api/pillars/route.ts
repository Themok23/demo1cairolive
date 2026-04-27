import { db } from '@/src/infrastructure/db/client';
import { pillars } from '@/src/infrastructure/db/schema';
import { asc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

/** Public endpoint — returns only ACTIVE pillars, ordered. Used by header nav. */
export async function GET() {
  try {
    const data = await db
      .select({
        id: pillars.id,
        slug: pillars.slug,
        nameEn: pillars.nameEn,
        nameAr: pillars.nameAr,
        descriptionEn: pillars.descriptionEn,
        descriptionAr: pillars.descriptionAr,
        iconKey: pillars.iconKey,
        coverImageUrl: pillars.coverImageUrl,
        displayOrder: pillars.displayOrder,
      })
      .from(pillars)
      .where(eq(pillars.isActive, true))
      .orderBy(asc(pillars.displayOrder), asc(pillars.nameEn));
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch pillars' }, { status: 500 });
  }
}
