import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/infrastructure/db/client';
import { persons } from '@/src/infrastructure/db/schema';
import { eq, sql } from 'drizzle-orm';
import { checkRateLimit } from '@/src/lib/rateLimit';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const ip = req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim() ?? 'unknown';
  if (!checkRateLimit(`share:${ip}:${id}`, 5, 3_600_000))
    return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });

  const existing = await db.select({ id: persons.id }).from(persons).where(eq(persons.id, id)).limit(1);
  if (!existing.length) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

  await db.update(persons).set({ shareCount: sql`${persons.shareCount} + 1` }).where(eq(persons.id, id));
  return NextResponse.json({ success: true });
}
