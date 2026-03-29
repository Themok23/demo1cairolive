import { db } from '@/src/infrastructure/db/client';
import { notifications } from '@/src/infrastructure/db/notificationsSchema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const notificationsList = await db
      .select()
      .from(notifications)
      .orderBy(desc(notifications.createdAt))
      .limit(20);

    return Response.json(notificationsList);
  } catch (error) {
    // If notifications table doesn't exist yet, return empty array
    console.error('Error fetching notifications:', error);
    return Response.json([]);
  }
}
