import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { DrizzleArticleRepository } from '@/src/infrastructure/repositories/drizzleArticleRepository';
import { DrizzlePersonRepository } from '@/src/infrastructure/repositories/drizzlePersonRepository';
import { ListArticlesUseCase } from '@/src/application/use-cases/articles/listArticles';
import { CreateArticleUseCase } from '@/src/application/use-cases/articles/createArticle';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;

    const articleRepository = new DrizzleArticleRepository();
    const useCase = new ListArticlesUseCase(articleRepository);

    const result = await useCase.execute({
      limit,
      offset,
      onlyPublished: true,
      category: category as any,
      status: status as any,
    });

    if (!result.success) {
      return NextResponse.json(errorResponse(result.error || 'Failed to fetch articles'), {
        status: 400,
      });
    }

    return NextResponse.json(
      successResponse(result.data?.articles, {
        total: result.data?.total,
        page: Math.floor(offset / limit) + 1,
        limit,
      })
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Failed to fetch articles'),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const articleRepository = new DrizzleArticleRepository();
    const personRepository = new DrizzlePersonRepository();
    const useCase = new CreateArticleUseCase(articleRepository, personRepository);

    const result = await useCase.execute(body);

    if (!result.success) {
      return NextResponse.json(errorResponse(result.error || 'Failed to create article'), {
        status: 400,
      });
    }

    return NextResponse.json(successResponse(result.data), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Failed to create article'),
      { status: 500 }
    );
  }
}
