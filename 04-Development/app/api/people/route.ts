import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { DrizzlePersonRepository } from '@/src/infrastructure/repositories/drizzlePersonRepository';
import { ListPeopleUseCase } from '@/src/application/use-cases/people/listPeople';
import { CreatePersonUseCase } from '@/src/application/use-cases/people/createPerson';
import { z } from 'zod';

const createPersonSchema = z.object({
  firstNameEn: z.string().min(1, 'First name is required').max(255),
  lastNameEn: z.string().min(1, 'Last name is required').max(255),
  email: z.string().email('Invalid email address'),
  gender: z.enum(['male', 'female', 'prefer-not-to-say', 'other']).default('prefer-not-to-say'),
  phoneNumber: z.string().max(20).optional(),
  bioEn: z.string().max(5000).optional(),
  currentPositionEn: z.string().max(255).optional(),
  currentCompanyEn: z.string().max(255).optional(),
  locationEn: z.string().max(255).optional(),
  tier: z.enum(['bronze', 'silver', 'gold', 'platinum']).optional(),
});

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
    const rawBody = await request.json();
    const validation = createPersonSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        errorResponse(validation.error.errors.map((e) => e.message).join(', ')),
        { status: 422 }
      );
    }
    const body = validation.data;

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
