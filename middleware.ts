import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  // Redirect vercel.app preview URLs to the canonical domain
  if (host.includes('vercel.app')) {
    const url = request.nextUrl.clone();
    url.host = 'shopbowandsternsoap.com';
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
