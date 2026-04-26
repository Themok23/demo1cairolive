import { auth } from '@/src/lib/auth';

import { db } from '@/src/infrastructure/db/client';
import { submissions, persons } from '@/src/infrastructure/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const submission = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, id));

    if (!submission.length) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json(submission[0]);
  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json({ error: 'Failed to fetch submission' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Get the submission
    const submission = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, id))
      .then((result) => result[0]);

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const now = new Date();

    // Wrap approval in a transaction to prevent orphaned person records
    if (status === 'approved') {
      await db.transaction(async (tx) => {
        const personId = crypto.randomUUID();
        await tx.insert(persons).values({
          id: personId,
          firstNameEn: submission.firstName,
          lastNameEn: submission.lastName,
          email: submission.email,
          phoneNumber: submission.phoneNumber,
          dateOfBirth: submission.dateOfBirth,
          gender: submission.gender,
          bioEn: submission.bio,
          profileImageUrl: submission.profileImageUrl,
          coverImageUrl: null,
          currentPositionEn: submission.currentPosition,
          currentCompanyEn: submission.currentCompany,
          locationEn: submission.location,
          tier: 'bronze',
          isVerified: false,
          isClaimed: false,
          claimedBy: null,
          keywords: submission.keywords,
          linkedinUrl: submission.linkedinUrl,
          twitterUrl: submission.twitterUrl,
          instagramUrl: submission.instagramUrl,
          websiteUrl: submission.websiteUrl,
          createdAt: now,
          updatedAt: now,
        });

        await tx
          .update(submissions)
          .set({ status, reviewedAt: now, updatedAt: now })
          .where(eq(submissions.id, id));
      });
    } else {
      // Rejection: just update status
      await db
        .update(submissions)
        .set({ status, reviewedAt: now, updatedAt: now })
        .where(eq(submissions.id, id));
    }

    return NextResponse.json({ message: `Submission ${status}` });
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}
