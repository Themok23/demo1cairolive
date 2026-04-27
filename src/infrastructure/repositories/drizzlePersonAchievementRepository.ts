import { eq, asc } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { db } from '../db/client';
import { personAchievement } from '../db/schema';
import { PersonAchievement } from '../../domain/entities/personAchievement';
import { PersonAchievementRepository } from '../../domain/repositories/personAchievementRepository';

export class DrizzlePersonAchievementRepository implements PersonAchievementRepository {
  private parse(row: any): PersonAchievement {
    return {
      ...row,
      displayOrder: row.displayOrder ?? 0,
      createdAt: new Date(row.createdAt),
    };
  }

  async listByPerson(personId: string): Promise<PersonAchievement[]> {
    const rows = await db
      .select()
      .from(personAchievement)
      .where(eq(personAchievement.personId, personId))
      .orderBy(asc(personAchievement.displayOrder), asc(personAchievement.createdAt));
    return rows.map((r) => this.parse(r));
  }

  async findById(id: string): Promise<PersonAchievement | null> {
    const rows = await db
      .select()
      .from(personAchievement)
      .where(eq(personAchievement.id, id))
      .limit(1);
    return rows[0] ? this.parse(rows[0]) : null;
  }

  async create(data: Omit<PersonAchievement, 'id' | 'createdAt'>): Promise<PersonAchievement> {
    const id = randomUUID();
    await db.insert(personAchievement).values({ id, ...data });
    return this.parse({ id, ...data, createdAt: new Date() });
  }

  async update(id: string, data: Partial<PersonAchievement>): Promise<PersonAchievement | null> {
    await db.update(personAchievement).set(data).where(eq(personAchievement.id, id));
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await db.delete(personAchievement).where(eq(personAchievement.id, id));
  }

  async reorder(personId: string, orderedIds: string[]): Promise<void> {
    await db.transaction(async (tx) => {
      for (let i = 0; i < orderedIds.length; i++) {
        await tx
          .update(personAchievement)
          .set({ displayOrder: i })
          .where(eq(personAchievement.id, orderedIds[i]));
      }
    });
  }
}
