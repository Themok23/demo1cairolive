import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/infrastructure/db/client';
import { persons } from '@/src/infrastructure/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await db.update(persons).set({ shareCount: sql`${persons.shareCount} + 1` }).where(eq(persons.id, id));
  return NextResponse.json({ success: true });
}
