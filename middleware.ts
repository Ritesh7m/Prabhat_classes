import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('sb-admin-token')?.value;
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  // Protect /admin routes from unauthenticated visits
  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect authenticated admin away from the login screen
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
