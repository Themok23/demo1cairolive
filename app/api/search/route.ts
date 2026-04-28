import { NextRequest, NextResponse } from 'next/server';
import { UnifiedSearchUseCase } from '@/src/application/use-cases/search/unifiedSearch';
import { DrizzleSearchRepository } from '@/src/infrastructure/repositories/drizzleSearchRepository';
import { checkRateLimit } from '@/src/lib/rateLimit';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!await checkRateLimit(`search:${ip}`, 30, 60_000))
    return NextResponse.json({ success: false, data: [], error: 'Too many requests' }, { status: 429 });
  const q = req.nextUrl.searchParams.get('q') ?? '';
  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') ?? '20'), 40);
  const result = await new UnifiedSearchUseCase(new DrizzleSearchRepository()).execute({ q, limit });
  return NextResponse.json(result);
}
