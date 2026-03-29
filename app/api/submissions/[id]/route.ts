import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    return NextResponse.json(
      errorResponse('Use /api/submissions to list or POST /api/submissions/[id]/review'),
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Failed to fetch submission'),
      { status: 500 }
    );
  }
}
