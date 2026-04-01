import { auth } from '@/src/lib/auth';
import { db } from '@/src/infrastructure/db/client';
import { notifications } from '@/src/infrastructure/db/notificationsSchema';
import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(sql`1=1`); // Update all records

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return Response.json({ success: false }, { status: 500 });
  }
}
