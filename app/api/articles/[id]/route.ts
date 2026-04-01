import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { DrizzleArticleRepository } from '@/src/infrastructure/repositories/drizzleArticleRepository';
import { GetArticleUseCase } from '@/src/application/use-cases/articles/getArticle';
import { UpdateArticleUseCase } from '@/src/application/use-cases/articles/updateArticle';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const repository = new DrizzleArticleRepository();
    const useCase = new GetArticleUseCase(repository);

    const result = await useCase.execute({ id });

    if (!result.success) {
      return NextResponse.json(errorResponse(result.error || 'Article not found'), {
        status: 404,
      });
    }

    return NextResponse.json(successResponse(result.data));
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Failed to fetch article'),
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const repository = new DrizzleArticleRepository();
    const useCase = new UpdateArticleUseCase(repository);

    const result = await useCase.execute({ id, ...body });

    if (!result.success) {
      return NextResponse.json(errorResponse(result.error || 'Failed to update article'), {
        status: 400,
      });
    }

    return NextResponse.json(successResponse(result.data));
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Failed to update article'),
      { status: 500 }
    );
  }
}
