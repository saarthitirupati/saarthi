import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_TOKEN = 'jeevapath_admin_2024';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (
    (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) ||
    (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/login'))
  ) {
    // Allow public GET access to places for client-side pages (Saved, Generating)
    if (request.method === 'GET' && pathname === '/api/admin/places') {
      return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;
    if (token !== ADMIN_TOKEN) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
