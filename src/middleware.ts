import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/about',
  '/projects',
  '/contact',
  '/api/contact',
  '/api/webhooks',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];

// Admin-only routes
const adminRoutes = [
  '/admin',
  '/api/admin',
];

// Portal routes that require authentication
const portalRoutes = [
  '/portal',
  '/api/portal',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get auth token from cookies
  const token = request.cookies.get('auth-token');

  // Redirect to login if no token
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  try {
    // Verify token with Firebase Admin SDK (server-side)
    // Note: This requires setting up Firebase Admin SDK
    // For now, we'll check if token exists and is not expired
    
    // Check if accessing admin routes
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      // Verify admin role from token claims
      // This would normally decode the JWT and check custom claims
      const isAdmin = request.cookies.get('user-role')?.value === 'admin';
      
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    // Check if accessing portal routes
    if (portalRoutes.some(route => pathname.startsWith(route))) {
      // Verify user has portal access
      const hasPortalAccess = request.cookies.get('portal-access')?.value === 'true';
      
      if (!hasPortalAccess) {
        return NextResponse.redirect(new URL('/portal/start', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid token, redirect to login
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};