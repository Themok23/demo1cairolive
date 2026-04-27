import { eq, desc, and, count } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { db } from '../db/client';
import { experiences, experienceReactions } from '../db/schema';
import { Experience, ExperienceStatus } from '../../domain/entities/experience';
import { ExperienceRepository, ListPublishedParams } from '../../domain/repositories/experienceRepository';

export class DrizzleExperienceRepository implements ExperienceRepository {
  private parse(row: Record<string, unknown>): Experience {
    return {
      ...row,
      likeCount: (row.likeCount as number) ?? 0,
      viewCount: (row.viewCount as number) ?? 0,
      createdAt: new Date(row.createdAt as string),
      updatedAt: new Date(row.updatedAt as string),
      publishedAt: row.publishedAt ? new Date(row.publishedAt as string) : null,
    } as Experience;
  }

  async listPublished(params: ListPublishedParams = {}): Promise<Experience[]> {
    const { limit = 20, offset = 0, pillarId, type } = params;
    const conditions = [eq(experiences.status, 'published')];
    if (pillarId) conditions.push(eq(experiences.pillarId, pillarId));
    if (type) conditions.push(eq(experiences.type, type));

    const rows = await db
      .select()
      .from(experiences)
      .where(and(...conditions))
      .orderBy(desc(experiences.publishedAt))
      .limit(limit)
      .offset(offset);
    return rows.map((r) => this.parse(r as Record<string, unknown>));
  }

  async listByStatus(status: ExperienceStatus): Promise<Experience[]> {
    const rows = await db
      .select()
      .from(experiences)
      .where(eq(experiences.status, status))
      .orderBy(desc(experiences.createdAt));
    return rows.map((r) => this.parse(r as Record<string, unknown>));
  }

  async findBySlug(slug: string): Promise<Experience | null> {
    const rows = await db.select().from(experiences).where(eq(experiences.slug, slug)).limit(1);
    return rows[0] ? this.parse(rows[0] as Record<string, unknown>) : null;
  }

  async findById(id: string): Promise<Experience | null> {
    const rows = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);
    return rows[0] ? this.parse(rows[0] as Record<string, unknown>) : null;
  }

  async create(data: Omit<Experience, 'id' | 'likeCount' | 'viewCount' | 'createdAt' | 'updatedAt' | 'publishedAt'>): Promise<Experience> {
    const id = randomUUID();
    const now = new Date();
    await db.insert(experiences).values({ id, ...data, likeCount: 0, viewCount: 0 });
    return this.parse({ id, ...data, likeCount: 0, viewCount: 0, createdAt: now, updatedAt: now, publishedAt: null } as Record<string, unknown>);
  }

  async updateStatus(id: string, status: 'published' | 'rejected', opts?: { rejectionReason?: string }): Promise<Experience | null> {
    const updates: Record<string, unknown> = { status, updatedAt: new Date() };
    if (status === 'published') updates.publishedAt = new Date();
    if (opts?.rejectionReason) updates.rejectionReason = opts.rejectionReason;
    await db.update(experiences).set(updates).where(eq(experiences.id, id));
    return this.findById(id);
  }

  async countByStatus(status: ExperienceStatus): Promise<number> {
    const result = await db.select({ n: count() }).from(experiences).where(eq(experiences.status, status));
    return result[0]?.n ?? 0;
  }

  async addReaction(experienceId: string, type: 'like' | 'visited' | 'wishlist', userIdentifier: string): Promise<void> {
    await db.insert(experienceReactions).values({
      id: randomUUID(),
      experienceId,
      type,
      userIdentifier,
    }).onConflictDoNothing();
  }

  async removeReaction(experienceId: string, type: 'like' | 'visited' | 'wishlist', userIdentifier: string): Promise<void> {
    await db.delete(experienceReactions).where(
      and(
        eq(experienceReactions.experienceId, experienceId),
        eq(experienceReactions.type, type),
        eq(experienceReactions.userIdentifier, userIdentifier),
      )
    );
  }

  async getUserReactions(experienceId: string, userIdentifier: string): Promise<string[]> {
    const rows = await db
      .select({ type: experienceReactions.type })
      .from(experienceReactions)
      .where(and(
        eq(experienceReactions.experienceId, experienceId),
        eq(experienceReactions.userIdentifier, userIdentifier),
      ));
    return rows.map((r) => r.type);
  }
}
