import { db } from '@/src/infrastructure/db/client';
import { notifications } from '@/src/infrastructure/db/notificationsSchema';
import { sql } from 'drizzle-orm';

export async function POST() {
  try {
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
