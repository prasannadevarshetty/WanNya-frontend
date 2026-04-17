import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const locales = ['en', 'ja'];
const publicPages = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify',
  '/search',
];

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'ja',
  localePrefix: 'always',
  localeDetection: false
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Handle public/static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/') ||
    pathname.includes('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Check for token
  const token = request.cookies.get('wanya_token')?.value;

  // 3. Determine if the page is public
  const pathnameWithoutLocale = pathname.replace(/^\/(en|ja)/, '') || '/';
  
  const isPublicPage = publicPages.some(page => 
    pathnameWithoutLocale === page || pathnameWithoutLocale === `${page}/`
  );

  // 4. If authenticated and on login/signup, redirect to dashboard
  if (token && (pathnameWithoutLocale === '/login' || pathnameWithoutLocale === '/signup')) {
    const locale = pathname.startsWith('/en') ? 'en' : 'ja';
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // 5. If not authenticated and trying to access a protected page, redirect to login
  if (!token && !isPublicPage) {
    const locale = pathname.startsWith('/en') ? 'en' : 'ja';
    const loginUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 6. Otherwise, let next-intl handle the locale routing
  return intlMiddleware(request);
}

export const config = {
  // Use the matcher from the original proxy.ts
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
