import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { DrizzlePersonRepository } from '@/src/infrastructure/repositories/drizzlePersonRepository';
import { ListPeopleUseCase } from '@/src/application/use-cases/people/listPeople';
import { CreatePersonUseCase } from '@/src/application/use-cases/people/createPerson';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const tier = searchParams.get('tier') || undefined;
    const search = searchParams.get('search') || undefined;

    const repository = new DrizzlePersonRepository();
    const useCase = new ListPeopleUseCase(repository);

    const result = await useCase.execute({
      limit,
      offset,
      tier: tier as any,
      search,
    });

    if (!result.success) {
      return NextResponse.json(errorResponse(result.error || 'Failed to fetch people'), {
        status: 400,
      });
    }

    return NextResponse.json(
      successResponse(result.data?.people, {
        total: result.data?.total,
        page: Math.floor(offset / limit) + 1,
        limit,
      })
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Failed to fetch people'),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const repository = new DrizzlePersonRepository();
    const useCase = new CreatePersonUseCase(repository);

    const result = await useCase.execute(body);

    if (!result.success) {
      return NextResponse.json(errorResponse(result.error || 'Failed to create person'), {
        status: 400,
      });
    }

    return NextResponse.json(successResponse(result.data), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Failed to create person'),
      { status: 500 }
    );
  }
}
