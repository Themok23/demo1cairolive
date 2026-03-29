import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { DrizzleSubmissionRepository } from '@/src/infrastructure/repositories/drizzleSubmissionRepository';
import { ListSubmissionsUseCase } from '@/src/application/use-cases/submissions/listSubmissions';
import { SubmitProfileUseCase } from '@/src/application/use-cases/submissions/submitProfile';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const status = searchParams.get('status') || undefined;

    const repository = new DrizzleSubmissionRepository();
    const useCase = new ListSubmissionsUseCase(repository);

    const result = await useCase.execute({
      limit,
      offset,
      status: status as any,
    });

    if (!result.success) {
      return NextResponse.json(errorResponse(result.error || 'Failed to fetch submissions'), {
        status: 400,
      });
    }

    return NextResponse.json(
      successResponse(result.data?.submissions, {
        total: result.data?.total,
        page: Math.floor(offset / limit) + 1,
        limit,
      })
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Failed to fetch submissions'),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const repository = new DrizzleSubmissionRepository();
    const useCase = new SubmitProfileUseCase(repository);

    const result = await useCase.execute(body);

    if (!result.success) {
      return NextResponse.json(errorResponse(result.error || 'Failed to create submission'), {
        status: 400,
      });
    }

    return NextResponse.json(successResponse(result.data), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Failed to create submission'),
      { status: 500 }
    );
  }
}
