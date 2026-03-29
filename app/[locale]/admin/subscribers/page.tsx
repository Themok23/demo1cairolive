import { db } from '@/src/infrastructure/db/client';
import { subscribers } from '@/src/infrastructure/db/schema';
import { desc } from 'drizzle-orm';
import AdminSubscribersList from '@/components/admin/subscribers-list';

export default async function AdminSubscribersPage() {
  const allSubscribers = await db
    .select()
    .from(subscribers)
    .orderBy(desc(subscribers.subscribedAt));

  return <AdminSubscribersList subscribers={allSubscribers} />;
}
