import { eq, asc } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { db } from '../db/client';
import { personWorkplace } from '../db/schema';
import { PersonWorkplace } from '../../domain/entities/personWorkplace';
import { PersonWorkplaceRepository } from '../../domain/repositories/personWorkplaceRepository';

export class DrizzlePersonWorkplaceRepository implements PersonWorkplaceRepository {
  private parse(row: any): PersonWorkplace {
    return {
      ...row,
      isCurrent: row.isCurrent ?? false,
      displayOrder: row.displayOrder ?? 0,
      fromDate: row.fromDate ? new Date(row.fromDate) : null,
      toDate: row.toDate ? new Date(row.toDate) : null,
      createdAt: new Date(row.createdAt),
    };
  }

  async listByPerson(personId: string): Promise<PersonWorkplace[]> {
    const rows = await db
      .select()
      .from(personWorkplace)
      .where(eq(personWorkplace.personId, personId))
      .orderBy(asc(personWorkplace.displayOrder), asc(personWorkplace.createdAt));
    return rows.map((r) => this.parse(r));
  }

  async findById(id: string): Promise<PersonWorkplace | null> {
    const rows = await db.select().from(personWorkplace).where(eq(personWorkplace.id, id)).limit(1);
    return rows[0] ? this.parse(rows[0]) : null;
  }

  private toDateStr(d: Date | string | null | undefined): string | null | undefined {
    return d instanceof Date ? d.toISOString().slice(0, 10) : d;
  }

  async create(data: Omit<PersonWorkplace, 'id' | 'createdAt'>): Promise<PersonWorkplace> {
    const id = randomUUID();
    await db.insert(personWorkplace).values({
      id,
      personId: data.personId,
      companyEn: data.companyEn,
      companyAr: data.companyAr,
      positionEn: data.positionEn,
      positionAr: data.positionAr,
      descriptionEn: data.descriptionEn,
      descriptionAr: data.descriptionAr,
      fromDate: this.toDateStr(data.fromDate),
      toDate: this.toDateStr(data.toDate),
      isCurrent: data.isCurrent,
      imageUrl: data.imageUrl,
      displayOrder: data.displayOrder,
    });
    return this.parse({ id, ...data, createdAt: new Date() });
  }

  async update(id: string, data: Partial<PersonWorkplace>): Promise<PersonWorkplace | null> {
    await db.update(personWorkplace).set({
      ...data,
      fromDate: this.toDateStr(data.fromDate),
      toDate: this.toDateStr(data.toDate),
    }).where(eq(personWorkplace.id, id));
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await db.delete(personWorkplace).where(eq(personWorkplace.id, id));
  }

  async reorder(personId: string, orderedIds: string[]): Promise<void> {
    await db.transaction(async (tx) => {
      for (let i = 0; i < orderedIds.length; i++) {
        await tx
          .update(personWorkplace)
          .set({ displayOrder: i })
          .where(eq(personWorkplace.id, orderedIds[i]));
      }
    });
  }
}
