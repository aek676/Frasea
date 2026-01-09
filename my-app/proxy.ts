import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { COOKIE_NAME, parseAuthCookie, verifyJwt } from './utils/jwt';

export async function proxy(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') ?? undefined;
  const token = parseAuthCookie(cookieHeader);

  const isProtectedRoute = !request.nextUrl.pathname.startsWith('/login');

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = verifyJwt(token);

    if (!payload) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  } else {
    if (token) {
      const payload = verifyJwt(token);
      if (payload) {
        return NextResponse.redirect(new URL('/translator', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
