import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. st-joseph.localhost:3000)
  const hostname = req.headers.get('host') || 'localhost:3000';

  // Get current path
  const searchParams = url.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

  // Handle local development subdomains
  // If it's something.localhost:3000, extract 'something'
  let subdomain = '';
  if (hostname.includes('.localhost:3000')) {
    subdomain = hostname.split('.localhost:3000')[0];
  } else if (hostname.split('.').length > 1) {
    subdomain = hostname.split('.')[0];
  }

  // If there's a subdomain and it's not 'www' or 'localhost', rewrite to the tenant route
  if (subdomain && subdomain !== 'localhost' && subdomain !== 'www' && subdomain !== '127') {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-tenant-slug', subdomain);

    return NextResponse.rewrite(
      new URL(`/tenants/${subdomain}${path}`, req.url),
      {
        request: {
          headers: requestHeaders,
        },
      }
    );
  }

  return NextResponse.next();
}
