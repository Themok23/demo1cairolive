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

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always pass the pathname to server components via a custom header
  // so layouts can know what path they're rendering for.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', pathname);

  if (isPublic(pathname)) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  /* Coming-soon gate — only enforced when COMING_SOON_TOKEN is set.
     This way local dev doesn't need to bypass anything; the gate is opt-in. */
  const validToken = process.env.COMING_SOON_TOKEN;
  if (validToken) {
    const cookieVal = req.cookies.get('cs_auth')?.value;
    if (cookieVal !== validToken) {
      const url = req.nextUrl.clone();
      url.pathname = '/coming-soon';
      return NextResponse.redirect(url);
    }
  }

  // intlMiddleware returns its own response; merge our header into it.
  const intlResponse = intlMiddleware(req);
  intlResponse.headers.set('x-pathname', pathname);
  return intlResponse;
}

export const config = {
  matcher: ['/', '/(ar|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
