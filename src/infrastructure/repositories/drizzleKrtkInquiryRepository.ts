import { randomUUID } from 'crypto';
import { desc, eq, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { krtkInquiries } from '../db/schema';
import { KrtkInquiry } from '../../domain/entities/krtkInquiry';
import { CreateInquiryData, KrtkInquiryRepository } from '../../domain/repositories/krtkInquiryRepository';

export class DrizzleKrtkInquiryRepository implements KrtkInquiryRepository {
  private parse(row: typeof krtkInquiries.$inferSelect): KrtkInquiry {
    return {
      id: row.id,
      krtkSlug: row.krtkSlug,
      senderName: row.senderName,
      senderEmail: row.senderEmail,
      senderPhone: row.senderPhone,
      subject: row.subject,
      message: row.message,
      status: row.status as KrtkInquiry['status'],
      forwardedAt: row.forwardedAt,
      forwardedTo: row.forwardedTo,
      metaJson: row.metaJson,
      createdAt: row.createdAt,
    };
  }

  async create(data: CreateInquiryData): Promise<KrtkInquiry> {
    const id = randomUUID();
    const rows = await db
      .insert(krtkInquiries)
      .values({
        id,
        krtkSlug: data.krtkSlug,
        senderName: data.senderName,
        senderEmail: data.senderEmail,
        senderPhone: data.senderPhone ?? null,
        subject: data.subject ?? null,
        message: data.message,
        status: 'new',
        metaJson: data.metaJson ?? null,
      })
      .returning();
    return this.parse(rows[0]);
  }

  async listBySlug(krtkSlug: string, limit = 50, offset = 0): Promise<KrtkInquiry[]> {
    const rows = await db
      .select()
      .from(krtkInquiries)
      .where(eq(krtkInquiries.krtkSlug, krtkSlug))
      .orderBy(desc(krtkInquiries.createdAt))
      .limit(limit)
      .offset(offset);
    return rows.map((r) => this.parse(r));
  }

  async listAll(limit = 50, offset = 0): Promise<KrtkInquiry[]> {
    const rows = await db
      .select()
      .from(krtkInquiries)
      .orderBy(desc(krtkInquiries.createdAt))
      .limit(limit)
      .offset(offset);
    return rows.map((r) => this.parse(r));
  }

  async countAll(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)::int` }).from(krtkInquiries);
    return result[0].count;
  }

  async countBySlug(krtkSlug: string): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)::int` }).from(krtkInquiries).where(eq(krtkInquiries.krtkSlug, krtkSlug));
    return result[0].count;
  }

  async findById(id: string): Promise<KrtkInquiry | null> {
    const rows = await db.select().from(krtkInquiries).where(eq(krtkInquiries.id, id)).limit(1);
    return rows.length ? this.parse(rows[0]) : null;
  }

  private async updateStatus(
    id: string,
    fields: Partial<typeof krtkInquiries.$inferInsert>
  ): Promise<KrtkInquiry> {
    const rows = await db
      .update(krtkInquiries)
      .set(fields)
      .where(eq(krtkInquiries.id, id))
      .returning();
    return this.parse(rows[0]);
  }

  async markRead(id: string): Promise<KrtkInquiry> {
    return this.updateStatus(id, { status: 'read' });
  }

  async markForwarded(id: string, forwardedTo: string): Promise<KrtkInquiry> {
    return this.updateStatus(id, {
      status: 'forwarded',
      forwardedTo,
      forwardedAt: new Date(),
    });
  }

  async markArchived(id: string): Promise<KrtkInquiry> {
    return this.updateStatus(id, { status: 'archived' });
  }
}
