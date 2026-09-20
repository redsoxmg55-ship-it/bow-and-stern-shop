import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DEAD_PRODUCT_REDIRECTS: Record<string, string> = {
  '/product/bunny-lemon-buoy': '/shop',
};

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;

  // Redirect removed product pages to shop
  if (DEAD_PRODUCT_REDIRECTS[pathname]) {
    return NextResponse.redirect(new URL(DEAD_PRODUCT_REDIRECTS[pathname], request.url), 301);
  }

  const response = NextResponse.next();
  // Tell search engines not to index the Vercel preview domain
  if (host.includes('vercel.app')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
