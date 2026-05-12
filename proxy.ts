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

export function proxy(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. st-joseph.localhost:3000)
  const hostname = req.headers.get('host') || 'localhost:3000';

  // Get current path
  const searchParams = url.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

  // Improved subdomain extraction
  let subdomain = '';
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
  
  if (hostname.includes('.localhost:3000')) {
    subdomain = hostname.split('.localhost:3000')[0];
  } else if (hostname.endsWith('.vercel.app')) {
    // Handle Vercel deployments (tenant.myapp.vercel.app)
    const parts = hostname.replace('.vercel.app', '').split('.');
    if (parts.length > 1) {
      subdomain = parts[0];
    }
  } else if (hostname !== rootDomain && hostname.endsWith(`.${rootDomain}`)) {
    // Handle custom domains (tenant.mycms.com)
    subdomain = hostname.replace(`.${rootDomain}`, '');
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
