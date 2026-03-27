import { eq, desc, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { submissions } from '../db/schema';
import { Submission } from '../../domain/entities/submission';
import { SubmissionRepository } from '../../domain/repositories/submissionRepository';

export class DrizzleSubmissionRepository implements SubmissionRepository {
  async findById(id: string): Promise<Submission | null> {
    const result = await db.query.submissions.findFirst({
      where: eq(submissions.id, id),
    });
    return result || null;
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<{ data: Submission[]; total: number }> {
    const limit = options?.limit || 20;
    const offset = options?.offset || 0;

    let query = db.select().from(submissions);

    if (options?.status) {
      query = query.where(eq(submissions.status, options.status));
    }

    const data = await query
      .orderBy(desc(submissions.submittedAt))
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(submissions);

    const total = countResult[0]?.count || 0;

    return { data: data as Submission[], total };
  }

  async create(submission: Submission): Promise<Submission> {
    const [created] = await db
      .insert(submissions)
      .values({
        id: submission.id,
        firstName: submission.firstName,
        lastName: submission.lastName,
        email: submission.email,
        phoneNumber: submission.phoneNumber,
        dateOfBirth: submission.dateOfBirth,
        gender: submission.gender,
        bio: submission.bio,
        profileImageUrl: submission.profileImageUrl,
        currentPosition: submission.currentPosition,
        currentCompany: submission.currentCompany,
        location: submission.location,
        keywords: submission.keywords ? JSON.stringify(submission.keywords) : null,
        linkedinUrl: submission.linkedinUrl,
        twitterUrl: submission.twitterUrl,
        instagramUrl: submission.instagramUrl,
        websiteUrl: submission.websiteUrl,
        status: submission.status,
        submittedBy: submission.submittedBy,
        reviewedBy: submission.reviewedBy,
        reviewNotes: submission.reviewNotes,
        submittedAt: submission.submittedAt,
        reviewedAt: submission.reviewedAt,
        updatedAt: submission.updatedAt,
      })
      .returning();

    return created as Submission;
  }

  async update(
    id: string,
    submission: Partial<Submission>
  ): Promise<Submission | null> {
    const [updated] = await db
      .update(submissions)
      .set({
        ...submission,
        updatedAt: new Date(),
        keywords: submission.keywords
          ? JSON.stringify(submission.keywords)
          : undefined,
      })
      .where(eq(submissions.id, id))
      .returning();

    return updated ? (updated as Submission) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(submissions)
      .where(eq(submissions.id, id));
    return result.rowCount > 0;
  }

  async approve(id: string, reviewedBy: string): Promise<Submission | null> {
    const [updated] = await db
      .update(submissions)
      .set({
        status: 'approved',
        reviewedBy,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(submissions.id, id))
      .returning();

    return updated ? (updated as Submission) : null;
  }

  async reject(
    id: string,
    reviewedBy: string,
    notes: string
  ): Promise<Submission | null> {
    const [updated] = await db
      .update(submissions)
      .set({
        status: 'rejected',
        reviewedBy,
        reviewNotes: notes,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(submissions.id, id))
      .returning();

    return updated ? (updated as Submission) : null;
  }

  async countByStatus(status: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(submissions)
      .where(eq(submissions.status, status));

    return result[0]?.count || 0;
  }

  async findPending(): Promise<Submission[]> {
    const results = await db
      .select()
      .from(submissions)
      .where(eq(submissions.status, 'pending'))
      .orderBy(desc(submissions.submittedAt));

    return results as Submission[];
  }
}
