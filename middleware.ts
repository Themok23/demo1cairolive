import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { createHmac } from 'crypto';
import { locales, defaultLocale } from './src/i18n';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

/* Paths that are always accessible — no password required */
const PUBLIC_PATHS = [
  '/coming-soon',
  '/api/auth/unlock',
  '/api/auth/',
  '/_next/',
  '/favicon',
  '/robots.txt',
  '/sitemap.xml',
  '/uploads/',
];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

/** Must match the token generation in /api/auth/unlock */
function makeToken(password: string): string {
  const secret = process.env.NEXTAUTH_SECRET || 'cairo-live-secret';
  return createHmac('sha256', secret).update(password).digest('hex');
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  const expected = process.env.COMING_SOON_PASSWORD;
  const cookieVal = req.cookies.get('cs_auth')?.value;

  /* Verify cookie is the HMAC of the current password, not the password itself */
  const validToken = expected ? makeToken(expected) : null;

  if (!validToken || cookieVal !== validToken) {
    const url = req.nextUrl.clone();
    url.pathname = '/coming-soon';
    return NextResponse.redirect(url);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/', '/(ar|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
