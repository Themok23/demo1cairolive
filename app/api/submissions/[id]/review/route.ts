import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { DrizzleSubmissionRepository } from '@/src/infrastructure/repositories/drizzleSubmissionRepository';
import { DrizzlePersonRepository } from '@/src/infrastructure/repositories/drizzlePersonRepository';
import { ReviewSubmissionUseCase } from '@/src/application/use-cases/submissions/reviewSubmission';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();

    const { action, reviewedBy, reviewNotes } = body;

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        errorResponse('Invalid action. Use "approve" or "reject".'),
        { status: 400 }
      );
    }

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
