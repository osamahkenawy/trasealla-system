import { NextResponse } from 'next/server';

/**
 * Middleware to protect routes and manage authentication
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies or header
  const token = request.cookies.get('trasealla_token')?.value;
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/reset-password',
    '/auth/lock-screen',
    '/error-pages',
  ];
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Admin routes that require authentication
  const isAdminRoute = pathname.startsWith('/dashboards') || 
                       pathname.startsWith('/base-ui') || 
                       pathname.startsWith('/forms') || 
                       pathname.startsWith('/tables') || 
                       pathname.startsWith('/icons') || 
                       pathname.startsWith('/apex-chart') || 
                       pathname.startsWith('/maps') || 
                       pathname.startsWith('/services') ||
                       pathname.match(/^\/(dark-mode|dark-sidenav|dark-topnav|hidden-sidenav|small-sidenav)/);
  
  // Redirect root to dashboards if authenticated, otherwise to sign-in
  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboards', request.url));
    } else {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }
  }
  
  // If trying to access protected route without token, redirect to sign-in
  if (isAdminRoute && !token) {
    const signInUrl = new URL('/auth/sign-in', request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }
  
  // If trying to access auth pages while authenticated, redirect to dashboard
  if (isPublicRoute && token && pathname.startsWith('/auth/sign-in')) {
    return NextResponse.redirect(new URL('/dashboards', request.url));
  }
  
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};