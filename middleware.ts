import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
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

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* Always let public paths through */
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  /* Check access cookie */
  const cookieVal = req.cookies.get('cs_auth')?.value;
  const expected = process.env.COMING_SOON_PASSWORD;

  if (!expected || cookieVal !== expected) {
    /* Not authenticated — redirect to coming soon */
    const url = req.nextUrl.clone();
    url.pathname = '/coming-soon';
    return NextResponse.redirect(url);
  }

  /* Authenticated — run normal i18n middleware */
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/', '/(ar|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
