import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { DrizzleSubscriberRepository } from '@/src/infrastructure/repositories/drizzleSubscriberRepository';
import { ListSubscribersUseCase } from '@/src/application/use-cases/subscribers/listSubscribers';
import { SubscribeUseCase } from '@/src/application/use-cases/subscribers/subscribe';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const onlyActive = searchParams.get('onlyActive') !== 'false';

    const repository = new DrizzleSubscriberRepository();
    const useCase = new ListSubscribersUseCase(repository);

    const result = await useCase.execute({
      limit,
      offset,
      onlyActive,
    });

    if (!result.success) {
      return NextResponse.json(errorResponse(result.error || 'Failed to fetch subscribers'), {
        status: 400,
      });
    }

    return NextResponse.json(
      successResponse(result.data?.subscribers, {
        total: result.data?.total,
        page: Math.floor(offset / limit) + 1,
        limit,
      })
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Failed to fetch subscribers'),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const repository = new DrizzleSubscriberRepository();
    const useCase = new SubscribeUseCase(repository);

    const result = await useCase.execute(body);

    if (!result.success) {
      return NextResponse.json(errorResponse(result.error || 'Failed to subscribe'), {
        status: 400,
      });
    }

    return NextResponse.json(successResponse(result.data), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Failed to subscribe'),
      { status: 500 }
    );
  }
}
