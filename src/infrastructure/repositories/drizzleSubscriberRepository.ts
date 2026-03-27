import { eq, desc, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { subscribers } from '../db/schema';
import { Subscriber } from '../../domain/entities/subscriber';
import { SubscriberRepository } from '../../domain/repositories/subscriberRepository';
import { v4 as uuidv4 } from 'crypto';

export class DrizzleSubscriberRepository implements SubscriberRepository {
  async findById(id: string): Promise<Subscriber | null> {
    const result = await db.query.subscribers.findFirst({
      where: eq(subscribers.id, id),
    });
    return result || null;
  }

  async findByEmail(email: string): Promise<Subscriber | null> {
    const result = await db.query.subscribers.findFirst({
      where: eq(subscribers.email, email),
    });
    return result || null;
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
    isActive?: boolean;
  }): Promise<{ data: Subscriber[]; total: number }> {
    const limit = options?.limit || 20;
    const offset = options?.offset || 0;

    let query = db.select().from(subscribers);

    if (options?.isActive !== undefined) {
      query = query.where(eq(subscribers.isActive, options.isActive));
    }

    const data = await query
      .orderBy(desc(subscribers.subscribedAt))
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(subscribers);

    const total = countResult[0]?.count || 0;

    return { data: data as Subscriber[], total };
  }

  async create(subscriber: Subscriber): Promise<Subscriber> {
    const [created] = await db
      .insert(subscribers)
      .values({
        id: subscriber.id,
        email: subscriber.email,
        firstName: subscriber.firstName,
        lastName: subscriber.lastName,
        isActive: subscriber.isActive,
        subscribedAt: subscriber.subscribedAt,
        unsubscribedAt: subscriber.unsubscribedAt,
        updatedAt: subscriber.updatedAt,
      })
      .returning();

    return created as Subscriber;
  }

  async update(
    id: string,
    subscriber: Partial<Subscriber>
  ): Promise<Subscriber | null> {
    const [updated] = await db
      .update(subscribers)
      .set({
        ...subscriber,
        updatedAt: new Date(),
      })
      .where(eq(subscribers.id, id))
      .returning();

    return updated ? (updated as Subscriber) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(subscribers)
      .where(eq(subscribers.id, id));
    return result.rowCount > 0;
  }

  async subscribe(
    email: string,
    firstName?: string,
    lastName?: string
  ): Promise<Subscriber> {
    const existing = await this.findByEmail(email);

    if (existing) {
      return await this.update(existing.id, {
        isActive: true,
        unsubscribedAt: undefined,
        updatedAt: new Date(),
      }) as Subscriber;
    }

    const newSubscriber: Subscriber = {
      id: uuidv4(),
      email,
      firstName,
      lastName,
      isActive: true,
      subscribedAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.create(newSubscriber);
  }

  async unsubscribe(email: string): Promise<Subscriber | null> {
    const subscriber = await this.findByEmail(email);

    if (!subscriber) {
      return null;
    }

    return await this.update(subscriber.id, {
      isActive: false,
      unsubscribedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async countActive(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(subscribers)
      .where(eq(subscribers.isActive, true));

    return result[0]?.count || 0;
  }
}
