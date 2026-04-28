import { NextRequest, NextResponse } from 'next/server';
import { DrizzleKrtkInquiryRepository } from '@/src/infrastructure/repositories/drizzleKrtkInquiryRepository';
import { CreateInquiryUseCase } from '@/src/application/use-cases/krtk-inquiries/createInquiry';
import { checkRateLimit } from '@/src/lib/rateLimit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (!await checkRateLimit(`inquiry:${ip}`, 5, 60_000)) {
    return NextResponse.json({ success: false, error: 'Too many requests. Try again shortly.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });

  const metaJson = JSON.stringify({
    userAgent: req.headers.get('user-agent'),
    referer: req.headers.get('referer'),
    ipPrefix: ip.split('.').slice(0, 3).join('.') + '.x',
  });

  const repo = new DrizzleKrtkInquiryRepository();
  const result = await new CreateInquiryUseCase(repo).execute({ ...body, metaJson });

  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 422 });
  }
  return NextResponse.json({ success: true }, { status: 201 });
}
