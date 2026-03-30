import { eq, desc, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { submissions } from '../db/schema';
import { Submission } from '../../domain/entities/submission';
import { SubmissionRepository } from '../../domain/repositories/submissionRepository';

export class DrizzleSubmissionRepository implements SubmissionRepository {
  private parseSubmission(data: any): Submission {
    return {
      ...data,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      keywords: data.keywords ? JSON.parse(data.keywords) : null,
    };
  }

  async findById(id: string): Promise<Submission | null> {
    const result = await db.query.submissions.findFirst({
      where: eq(submissions.id, id),
    });
    return result ? this.parseSubmission(result) : null;
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<{ data: Submission[]; total: number }> {
    const limit = options?.limit || 20;
    const offset = options?.offset || 0;

    const conditions = [];

    if (options?.status) {
      conditions.push(eq(submissions.status, options.status));
    }

    const whereClause = conditions.length > 0 ? conditions[0] : undefined;

    const data = await db
      .select()
      .from(submissions)
      .where(whereClause)
      .orderBy(desc(submissions.submittedAt))
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(submissions)
      .where(whereClause);

    const total = countResult[0]?.count || 0;

    return { data: data.map(d => this.parseSubmission(d)), total };
  }

  async create(submission: Submission): Promise<Submission> {
    const values: any = {
      id: submission.id,
      firstName: submission.firstName,
      lastName: submission.lastName,
      email: submission.email,
      phoneNumber: submission.phoneNumber,
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
    };

    if (submission.dateOfBirth) {
      values.dateOfBirth = submission.dateOfBirth;
    }

    const [created] = await db
      .insert(submissions)
      .values(values)
      .returning();

    return this.parseSubmission(created);
  }

  async update(
    id: string,
    submission: Partial<Submission>
  ): Promise<Submission | null> {
    const updates: any = {
      updatedAt: new Date(),
    };

    if (submission.firstName !== undefined) updates.firstName = submission.firstName;
    if (submission.lastName !== undefined) updates.lastName = submission.lastName;
    if (submission.email !== undefined) updates.email = submission.email;
    if (submission.phoneNumber !== undefined) updates.phoneNumber = submission.phoneNumber;
    if (submission.dateOfBirth !== undefined) updates.dateOfBirth = submission.dateOfBirth;
    if (submission.gender !== undefined) updates.gender = submission.gender;
    if (submission.bio !== undefined) updates.bio = submission.bio;
    if (submission.profileImageUrl !== undefined) updates.profileImageUrl = submission.profileImageUrl;
    if (submission.currentPosition !== undefined) updates.currentPosition = submission.currentPosition;
    if (submission.currentCompany !== undefined) updates.currentCompany = submission.currentCompany;
    if (submission.location !== undefined) updates.location = submission.location;
    if (submission.keywords !== undefined) updates.keywords = submission.keywords ? JSON.stringify(submission.keywords) : null;
    if (submission.linkedinUrl !== undefined) updates.linkedinUrl = submission.linkedinUrl;
    if (submission.twitterUrl !== undefined) updates.twitterUrl = submission.twitterUrl;
    if (submission.instagramUrl !== undefined) updates.instagramUrl = submission.instagramUrl;
    if (submission.websiteUrl !== undefined) updates.websiteUrl = submission.websiteUrl;
    if (submission.status !== undefined) updates.status = submission.status;
    if (submission.submittedBy !== undefined) updates.submittedBy = submission.submittedBy;
    if (submission.reviewedBy !== undefined) updates.reviewedBy = submission.reviewedBy;
    if (submission.reviewNotes !== undefined) updates.reviewNotes = submission.reviewNotes;
    if (submission.submittedAt !== undefined) updates.submittedAt = submission.submittedAt;
    if (submission.reviewedAt !== undefined) updates.reviewedAt = submission.reviewedAt;

    const [updated] = await db
      .update(submissions)
      .set(updates)
      .where(eq(submissions.id, id))
      .returning();

    return updated ? this.parseSubmission(updated) : null;
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

    return updated ? this.parseSubmission(updated) : null;
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

    return updated ? this.parseSubmission(updated) : null;
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

    return results.map(r => this.parseSubmission(r));
  }
}