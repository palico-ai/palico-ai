import { NextRequest, NextResponse } from 'next/server';
import { RoutePath } from './utils/route_path';
import { cookies } from 'next/headers';
import { decrypt, isDevMode } from './services/auth/session';

const PUBLIC_PATHS = new Set([RoutePath.login()]);

export default async function middleware(req: NextRequest) {
  const path = new URL(req.nextUrl).pathname;
  const isPublicRoute = PUBLIC_PATHS.has(path);
  if (isDevMode()) {
    console.log('Dev mode enabled - skipping auth middleware');
    if (isPublicRoute) {
      return NextResponse.redirect(new URL(RoutePath.chat(), req.nextUrl));
    }
    return NextResponse.next();
  }
  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);
  if (!isPublicRoute && !session) {
    return NextResponse.redirect(new URL(RoutePath.login(), req.nextUrl));
  }

  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL(RoutePath.chat(), req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
