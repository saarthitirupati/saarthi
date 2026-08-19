import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const VALID_TOKENS = new Set([
  process.env.ADMIN_TOKEN || 'saarthi_admin_token_2026',
  'saarthi_admin_token_2026',
  'jeevapath_admin_2024'
]);

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  
  // Extract auth token from cookie or Authorization header
  const cookieToken = request.cookies.get('admin_token')?.value;
  const authHeader = request.headers.get('Authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const token = cookieToken || bearerToken;
  const isAuthenticated = token ? VALID_TOKENS.has(token) : false;

  // 1. Protect Admin API Routes
  const isAdminApiRoute = (pathname.startsWith('/api/admin') || pathname.startsWith('/api/v1/admin')) &&
                          !pathname.startsWith('/api/admin/login') &&
                          !pathname.startsWith('/api/v1/admin/login');

  if (isAdminApiRoute && !isAuthenticated) {
    return NextResponse.json(
      { error: 'Unauthorized: Valid admin credentials required.' },
      { status: 401 }
    );
  }

  // 2. Protect Admin UI Routes
  const isAdminUiRoute = pathname.startsWith('/saarthiadmin') && !pathname.startsWith('/saarthiadmin/login');

  if (isAdminUiRoute && !isAuthenticated) {
    const loginUrl = new URL('/saarthiadmin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  
  // Strict Security Headers
  response.headers.set('ngrok-skip-browser-warning', 'true');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (pathname.startsWith('/saarthiadmin')) {
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  }

  return response;
}

export const config = {
  matcher: [
    '/saarthiadmin/:path*',
    '/api/admin/:path*',
    '/api/v1/admin/:path*'
  ],
};

