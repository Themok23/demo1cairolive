import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/src/lib/rateLimit';

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';

  if (!await checkRateLimit(`unlock:${ip}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again in 15 minutes.' },
      { status: 429 }
    );
  }

  const { password } = await req.json();
  const correct = process.env.COMING_SOON_PASSWORD;
  const token = process.env.COMING_SOON_TOKEN;

  if (!correct || !token || password !== correct) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }

  /* Set the static token as the cookie — middleware validates against this */
  const res = NextResponse.json({ ok: true });
  res.cookies.set('cs_auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 14,
    path: '/',
  });
  return res;
}
