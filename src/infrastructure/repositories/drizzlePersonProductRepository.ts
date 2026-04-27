import { eq, asc } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { db } from '../db/client';
import { personProduct } from '../db/schema';
import { PersonProduct } from '../../domain/entities/personProduct';
import { PersonProductRepository } from '../../domain/repositories/personProductRepository';

export class DrizzlePersonProductRepository implements PersonProductRepository {
  private parse(row: any): PersonProduct {
    return {
      ...row,
      isActive: row.isActive ?? true,
      displayOrder: row.displayOrder ?? 0,
      createdAt: new Date(row.createdAt),
    };
  }

  async listByPerson(personId: string): Promise<PersonProduct[]> {
    const rows = await db
      .select()
      .from(personProduct)
      .where(eq(personProduct.personId, personId))
      .orderBy(asc(personProduct.displayOrder), asc(personProduct.createdAt));
    return rows.map((r) => this.parse(r));
  }

  async findById(id: string): Promise<PersonProduct | null> {
    const rows = await db.select().from(personProduct).where(eq(personProduct.id, id)).limit(1);
    return rows[0] ? this.parse(rows[0]) : null;
  }

  async create(data: Omit<PersonProduct, 'id' | 'createdAt'>): Promise<PersonProduct> {
    const id = randomUUID();
    await db.insert(personProduct).values({ id, ...data });
    return this.parse({ id, ...data, createdAt: new Date() });
  }

  async update(id: string, data: Partial<PersonProduct>): Promise<PersonProduct | null> {
    await db.update(personProduct).set(data).where(eq(personProduct.id, id));
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await db.delete(personProduct).where(eq(personProduct.id, id));
  }

  async reorder(personId: string, orderedIds: string[]): Promise<void> {
    await db.transaction(async (tx) => {
      for (let i = 0; i < orderedIds.length; i++) {
        await tx
          .update(personProduct)
          .set({ displayOrder: i })
          .where(eq(personProduct.id, orderedIds[i]));
      }
    });
  }
}
