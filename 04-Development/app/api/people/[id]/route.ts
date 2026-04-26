import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { DrizzlePersonRepository } from '@/src/infrastructure/repositories/drizzlePersonRepository';
import { GetPersonUseCase } from '@/src/application/use-cases/people/getPerson';
import { UpdatePersonUseCase } from '@/src/application/use-cases/people/updatePerson';
import { ClaimProfileUseCase } from '@/src/application/use-cases/people/claimProfile';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const repository = new DrizzlePersonRepository();
    const useCase = new GetPersonUseCase(repository);

    const result = await useCase.execute({ id });

    if (!result.success) {
      return NextResponse.json(errorResponse(result.error || 'Person not found'), {
        status: 404,
      });
    }

    return NextResponse.json(successResponse(result.data));
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Failed to fetch person'),
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const repository = new DrizzlePersonRepository();
    const useCase = new UpdatePersonUseCase(repository);

    const result = await useCase.execute({ id, ...body });

    if (!result.success) {
      return NextResponse.json(errorResponse(result.error || 'Failed to update person'), {
        status: 400,
      });
    }

    return NextResponse.json(successResponse(result.data));
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Failed to update person'),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.action === 'claim') {
      const repository = new DrizzlePersonRepository();
      const useCase = new ClaimProfileUseCase(repository);

      const result = await useCase.execute({
        id,
        claimedBy: body.claimedBy,
        upgradeTier: body.upgradeTier,
      });

      if (!result.success) {
        return NextResponse.json(errorResponse(result.error || 'Failed to claim profile'), {
          status: 400,
        });
      }

      return NextResponse.json(successResponse(result.data));
    }

    return NextResponse.json(errorResponse('Invalid action'), { status: 400 });
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Failed to process claim'),
      { status: 500 }
    );
  }
}
