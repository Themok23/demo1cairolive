import { pgTable, varchar, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const notifications = pgTable('notifications', {
  id: varchar('id', { length: 36 }).primaryKey(),
  type: varchar('type', { length: 50 }).notNull(), // 'new_submission', 'new_subscriber', 'article_published'
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  entityId: varchar('entity_id', { length: 36 }), // reference to related entity
  entityType: varchar('entity_type', { length: 50 }), // 'submission', 'subscriber', 'article'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
