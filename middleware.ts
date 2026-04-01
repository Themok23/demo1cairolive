import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

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

  if (isPublic(pathname)) return NextResponse.next();

  /* Compare against the pre-computed static token — no crypto needed in Edge */
  const validToken = process.env.COMING_SOON_TOKEN;
  const cookieVal = req.cookies.get('cs_auth')?.value;

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
