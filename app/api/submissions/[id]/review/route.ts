import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();

    const { action, notes } = body;

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        errorResponse('Invalid action. Use "approve" or "reject".'),
        { status: 400 }
      );
    }

    // TODO: Implement submission review
    return NextResponse.json(
      errorResponse('Submission review not yet implemented'),
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Failed to review submission'),
      { status: 500 }
    );
  }
}
