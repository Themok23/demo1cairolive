import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // TODO: Implement person retrieval from database
    return NextResponse.json(
      errorResponse('Person not found'),
      { status: 404 }
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Failed to fetch person'),
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();

    // TODO: Implement person update
    return NextResponse.json(
      errorResponse('Person update not yet implemented'),
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Failed to update person'),
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // TODO: Implement person deletion
    return NextResponse.json(
      errorResponse('Person deletion not yet implemented'),
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Failed to delete person'),
      { status: 500 }
    );
  }
}
