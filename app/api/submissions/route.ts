import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { DrizzleSubmissionRepository } from '@/src/infrastructure/repositories/drizzleSubmissionRepository';
import { ListSubmissionsUseCase } from '@/src/application/use-cases/submissions/listSubmissions';
import { SubmitProfileUseCase } from '@/src/application/use-cases/submissions/submitProfile';
import { auth } from '@/src/lib/auth';
import { checkRateLimit } from '@/src/lib/rateLimit';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
  }

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
    console.error('[submissions] GET error:', error);
    return NextResponse.json(errorResponse('Failed to fetch submissions'), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';

  if (!await checkRateLimit(`profile-submit:${ip}`, 3, 3_600_000)) {
    return NextResponse.json(
      errorResponse('Too many submissions. Please try again later.'),
      { status: 429 }
    );
  }

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
    console.error('[submissions] POST error:', error);
    return NextResponse.json(errorResponse('Failed to create submission'), { status: 500 });
  }
}
