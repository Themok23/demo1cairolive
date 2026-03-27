import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // TODO: Implement articles listing from database
    return NextResponse.json(
      successResponse(
        {
          articles: [],
          total: 0,
        },
        { total: 0, page: Math.floor(offset / limit) + 1, limit }
      )
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
    // TODO: Implement article creation
    return NextResponse.json(
      errorResponse('Article creation not yet implemented'),
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Failed to create article'),
      { status: 500 }
    );
  }
}
