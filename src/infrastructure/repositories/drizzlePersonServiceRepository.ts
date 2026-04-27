import { eq, asc } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { db } from '../db/client';
import { personService } from '../db/schema';
import { PersonService } from '../../domain/entities/personService';
import { PersonServiceRepository } from '../../domain/repositories/personServiceRepository';

export class DrizzlePersonServiceRepository implements PersonServiceRepository {
  private parse(row: any): PersonService {
    return {
      ...row,
      isActive: row.isActive ?? true,
      displayOrder: row.displayOrder ?? 0,
      createdAt: new Date(row.createdAt),
    };
  }

  async listByPerson(personId: string): Promise<PersonService[]> {
    const rows = await db
      .select()
      .from(personService)
      .where(eq(personService.personId, personId))
      .orderBy(asc(personService.displayOrder), asc(personService.createdAt));
    return rows.map((r) => this.parse(r));
  }

  async findById(id: string): Promise<PersonService | null> {
    const rows = await db.select().from(personService).where(eq(personService.id, id)).limit(1);
    return rows[0] ? this.parse(rows[0]) : null;
  }

  async create(data: Omit<PersonService, 'id' | 'createdAt'>): Promise<PersonService> {
    const id = randomUUID();
    await db.insert(personService).values({ id, ...data });
    return this.parse({ id, ...data, createdAt: new Date() });
  }

  async update(id: string, data: Partial<PersonService>): Promise<PersonService | null> {
    await db.update(personService).set(data).where(eq(personService.id, id));
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await db.delete(personService).where(eq(personService.id, id));
  }

  async reorder(personId: string, orderedIds: string[]): Promise<void> {
    await db.transaction(async (tx) => {
      for (let i = 0; i < orderedIds.length; i++) {
        await tx
          .update(personService)
          .set({ displayOrder: i })
          .where(eq(personService.id, orderedIds[i]));
      }
    });
  }
}
