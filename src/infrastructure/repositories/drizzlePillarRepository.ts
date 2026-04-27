import { eq, like, and, or, asc, desc, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { pillars } from '../db/schema';
import { Pillar } from '../../domain/entities/pillar';
import { PillarRepository } from '../../domain/repositories/pillarRepository';

export class DrizzlePillarRepository implements PillarRepository {
  private parsePillar(data: any): Pillar {
    return {
      ...data,
      displayOrder: data.displayOrder ?? 0,
      isActive: data.isActive ?? true,
    };
  }

  async findById(id: string): Promise<Pillar | null> {
    const result = await db.select().from(pillars).where(eq(pillars.id, id)).limit(1);
    return result[0] ? this.parsePillar(result[0]) : null;
  }

  async findBySlug(slug: string): Promise<Pillar | null> {
    const result = await db.select().from(pillars).where(eq(pillars.slug, slug)).limit(1);
    return result[0] ? this.parsePillar(result[0]) : null;
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
    isActive?: boolean;
    search?: string;
  }): Promise<{ data: Pillar[]; total: number }> {
    const limit  = options?.limit  ?? 50;
    const offset = options?.offset ?? 0;

    const conditions = [];
    if (typeof options?.isActive === 'boolean') {
      conditions.push(eq(pillars.isActive, options.isActive));
    }
    if (options?.search) {
      conditions.push(
        or(
          like(pillars.nameEn, `%${options.search}%`),
          like(pillars.nameAr, `%${options.search}%`),
          like(pillars.slug, `%${options.search}%`)
        )
      );
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db
      .select()
      .from(pillars)
      .where(whereClause)
      .orderBy(asc(pillars.displayOrder), asc(pillars.nameEn))
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(pillars)
      .where(whereClause);

    const total = Number(countResult[0]?.count ?? 0);
    return { data: data.map(d => this.parsePillar(d)), total };
  }

  async findActiveOrdered(): Promise<Pillar[]> {
    const data = await db
      .select()
      .from(pillars)
      .where(eq(pillars.isActive, true))
      .orderBy(asc(pillars.displayOrder), asc(pillars.nameEn));
    return data.map(d => this.parsePillar(d));
  }

  async create(pillar: Pillar): Promise<Pillar> {
    const values = {
      id: pillar.id,
      slug: pillar.slug,
      nameEn: pillar.nameEn,
      nameAr: pillar.nameAr,
      descriptionEn: pillar.descriptionEn,
      descriptionAr: pillar.descriptionAr,
      iconKey: pillar.iconKey,
      coverImageUrl: pillar.coverImageUrl,
      displayOrder: pillar.displayOrder,
      isActive: pillar.isActive,
      createdAt: pillar.createdAt,
      updatedAt: pillar.updatedAt,
    };
    const result = await db.insert(pillars).values(values).returning();
    return this.parsePillar(result[0]);
  }

  async update(id: string, pillar: Partial<Pillar>): Promise<Pillar | null> {
    const values: any = { updatedAt: new Date() };
    if (pillar.slug          !== undefined) values.slug          = pillar.slug;
    if (pillar.nameEn        !== undefined) values.nameEn        = pillar.nameEn;
    if (pillar.nameAr        !== undefined) values.nameAr        = pillar.nameAr;
    if (pillar.descriptionEn !== undefined) values.descriptionEn = pillar.descriptionEn;
    if (pillar.descriptionAr !== undefined) values.descriptionAr = pillar.descriptionAr;
    if (pillar.iconKey       !== undefined) values.iconKey       = pillar.iconKey;
    if (pillar.coverImageUrl !== undefined) values.coverImageUrl = pillar.coverImageUrl;
    if (pillar.displayOrder  !== undefined) values.displayOrder  = pillar.displayOrder;
    if (pillar.isActive      !== undefined) values.isActive      = pillar.isActive;

    const result = await db
      .update(pillars)
      .set(values)
      .where(eq(pillars.id, id))
      .returning();
    return result[0] ? this.parsePillar(result[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(pillars).where(eq(pillars.id, id)).returning();
    return result.length > 0;
  }

  async reorder(updates: Array<{ id: string; displayOrder: number }>): Promise<void> {
    // Drizzle Neon HTTP doesn't support transactions, so we run sequentially.
    for (const u of updates) {
      await db
        .update(pillars)
        .set({ displayOrder: u.displayOrder, updatedAt: new Date() })
        .where(eq(pillars.id, u.id));
    }
  }
}
