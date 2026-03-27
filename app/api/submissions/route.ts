import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const status = searchParams.get('status');

    // TODO: Implement submissions listing from database
    return NextResponse.json(
      successResponse(
        {
          submissions: [],
          total: 0,
        },
        { total: 0, page: Math.floor(offset / limit) + 1, limit }
      )
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

    // TODO: Implement submission creation
    return NextResponse.json(
      successResponse(
        {
          id: 'temp',
          message: 'Submission received',
        }
      ),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Failed to create submission'),
      { status: 500 }
    );
  }
}
