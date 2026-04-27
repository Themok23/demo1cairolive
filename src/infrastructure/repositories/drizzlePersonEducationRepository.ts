import { eq, asc } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { db } from '../db/client';
import { personEducation } from '../db/schema';
import { PersonEducation } from '../../domain/entities/personEducation';
import { PersonEducationRepository } from '../../domain/repositories/personEducationRepository';

export class DrizzlePersonEducationRepository implements PersonEducationRepository {
  private parse(row: any): PersonEducation {
    return {
      ...row,
      displayOrder: row.displayOrder ?? 0,
      createdAt: new Date(row.createdAt),
    };
  }

  async listByPerson(personId: string): Promise<PersonEducation[]> {
    const rows = await db
      .select()
      .from(personEducation)
      .where(eq(personEducation.personId, personId))
      .orderBy(asc(personEducation.displayOrder), asc(personEducation.createdAt));
    return rows.map((r) => this.parse(r));
  }

  async findById(id: string): Promise<PersonEducation | null> {
    const rows = await db.select().from(personEducation).where(eq(personEducation.id, id)).limit(1);
    return rows[0] ? this.parse(rows[0]) : null;
  }

  async create(data: Omit<PersonEducation, 'id' | 'createdAt'>): Promise<PersonEducation> {
    const id = randomUUID();
    await db.insert(personEducation).values({ id, ...data });
    return this.parse({ id, ...data, createdAt: new Date() });
  }

  async update(id: string, data: Partial<PersonEducation>): Promise<PersonEducation | null> {
    await db.update(personEducation).set(data).where(eq(personEducation.id, id));
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await db.delete(personEducation).where(eq(personEducation.id, id));
  }

  async reorder(personId: string, orderedIds: string[]): Promise<void> {
    await db.transaction(async (tx) => {
      for (let i = 0; i < orderedIds.length; i++) {
        await tx
          .update(personEducation)
          .set({ displayOrder: i })
          .where(eq(personEducation.id, orderedIds[i]));
      }
    });
  }
}
