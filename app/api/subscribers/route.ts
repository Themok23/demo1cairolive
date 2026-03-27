import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // TODO: Implement subscribers listing from database
    return NextResponse.json(
      successResponse(
        {
          subscribers: [],
          total: 0,
        },
        { total: 0, page: Math.floor(offset / limit) + 1, limit }
      )
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
    const { email, firstName, lastName } = body;

    if (!email) {
      return NextResponse.json(
        errorResponse('Email is required'),
        { status: 400 }
      );
    }

    // TODO: Implement subscriber creation
    return NextResponse.json(
      successResponse(
        {
          id: 'temp',
          email,
          message: 'Successfully subscribed',
        }
      ),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Failed to subscribe'),
      { status: 500 }
    );
  }
}
