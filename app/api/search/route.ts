import { NextRequest, NextResponse } from 'next/server';
import { UnifiedSearchUseCase } from '@/src/application/use-cases/search/unifiedSearch';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') ?? '20'), 40);
  const result = await new UnifiedSearchUseCase().execute({ q, limit });
  return NextResponse.json(result);
}
