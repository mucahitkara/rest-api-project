import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/auth'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;

  // Legacy redirects
  if (pathname === '/login') {
    return NextResponse.redirect(new URL('/auth?mode=login', request.url));
  }
  if (pathname === '/register') {
    return NextResponse.redirect(new URL('/auth?mode=register', request.url));
  }

  // If logged in and visiting auth pages → redirect to dashboard
  if (token && PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If not logged in and visiting a protected page → redirect to auth
  if (!token && !PUBLIC_PATHS.some((p) => pathname.startsWith(p)) && pathname !== '/') {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
