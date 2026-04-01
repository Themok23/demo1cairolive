import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

/* Simple in-memory rate limiter — resets on server restart, fine for a preview gate */
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 min

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = attempts.get(ip);
  if (!record || now > record.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  record.count += 1;
  return record.count > MAX_ATTEMPTS;
}

/** HMAC token derived from password — never store the raw password in a cookie */
function makeToken(password: string): string {
  const secret = process.env.NEXTAUTH_SECRET || 'cairo-live-secret';
  return createHmac('sha256', secret).update(password).digest('hex');
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again in 15 minutes.' },
      { status: 429 }
    );
  }

  const { password } = await req.json();
  const correct = process.env.COMING_SOON_PASSWORD;

  if (!correct || password !== correct) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }

  /* Store HMAC token — not the password itself */
  const token = makeToken(correct);
  const res = NextResponse.json({ ok: true });
  res.cookies.set('cs_auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 14, // 14 days
    path: '/',
  });
  return res;
}
