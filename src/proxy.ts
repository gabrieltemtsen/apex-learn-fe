import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get('apexlearn-auth')?.value;
  let isAuthenticated = false;

  if (authCookie) {
    try {
      const { state } = JSON.parse(authCookie);
      isAuthenticated = !!state?.accessToken;
    } catch { /* ignore */ }
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/instructor/:path*', '/courses/:path*/learn', '/assessments/:path*', '/certificates'],
};
