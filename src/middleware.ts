import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  
  // Protect admin routes using the custom login page
  if (url.pathname.startsWith('/saarthiadmin') && !url.pathname.startsWith('/saarthiadmin/login')) {
    const token = request.cookies.get('admin_token')?.value;
    if (token !== 'jeevapath_admin_2024') {
      return NextResponse.redirect(new URL('/saarthiadmin/login', request.url));
    }
  }

  const response = NextResponse.next();
  
  // Set ngrok skip browser warning header on all responses
  response.headers.set('ngrok-skip-browser-warning', 'true');
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, ngrok-skip-browser-warning');

  return response;
}

export const config = {
  matcher: '/:path*',
};

