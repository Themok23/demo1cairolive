import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { DrizzleSubmissionRepository } from '@/src/infrastructure/repositories/drizzleSubmissionRepository';
import { DrizzlePersonRepository } from '@/src/infrastructure/repositories/drizzlePersonRepository';
import { ReviewSubmissionUseCase } from '@/src/application/use-cases/submissions/reviewSubmission';
import { z } from 'zod';

const reviewSchema = z.object({
  action: z.enum(['approve', 'reject']),
  reviewedBy: z.string().min(1).max(100),
  reviewNotes: z.string().max(2000).optional(),
});

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const rawBody = await request.json();
    const validation = reviewSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        errorResponse('Validation failed: ' + validation.error.issues.map(i => i.message).join(', ')),
        { status: 422 }
      );
    }

    const { action, reviewedBy, reviewNotes } = validation.data;

    const submissionRepository = new DrizzleSubmissionRepository();
    const personRepository = new DrizzlePersonRepository();
    const useCase = new ReviewSubmissionUseCase(submissionRepository, personRepository);

    const result = await useCase.execute({
      id,
      action: action as 'approve' | 'reject',
      reviewedBy,
      reviewNotes,
    });

    if (!result.success) {
      return NextResponse.json(errorResponse(result.error || 'Failed to review submission'), {
        status: 400,
      });
    }

    return NextResponse.json(successResponse(result.data));
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Failed to review submission'),
      { status: 500 }
    );
  }
}
