import { auth } from '@/src/lib/auth';

import { db } from '@/src/infrastructure/db/client';
import { submissions, persons } from '@/src/infrastructure/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const submission = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, params.id));

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
      .where(eq(submissions.id, params.id))
      .then((result) => result[0]);

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // If approved, create a person from the submission
    if (status === 'approved') {
      const personId = crypto.randomUUID();
      await db.insert(persons).values({
        id: personId,
        firstName: submission.firstName,
        lastName: submission.lastName,
        email: submission.email,
        phoneNumber: submission.phoneNumber,
        dateOfBirth: submission.dateOfBirth,
        gender: submission.gender,
        bio: submission.bio,
        profileImageUrl: submission.profileImageUrl,
        coverImageUrl: null,
        currentPosition: submission.currentPosition,
        currentCompany: submission.currentCompany,
        location: submission.location,
        tier: 'bronze',
        isVerified: false,
        isClaimed: false,
        claimedBy: null,
        keywords: submission.keywords,
        linkedinUrl: submission.linkedinUrl,
        twitterUrl: submission.twitterUrl,
        instagramUrl: submission.instagramUrl,
        websiteUrl: submission.websiteUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Update submission status
    const now = new Date();
    await db
      .update(submissions)
      .set({
        status,
        reviewedAt: now,
        updatedAt: now,
      })
      .where(eq(submissions.id, params.id));

    return NextResponse.json({ message: `Submission ${status}` });
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}
