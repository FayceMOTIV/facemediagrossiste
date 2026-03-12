import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes publiques (no auth needed)
const PUBLIC_ROUTES = ['/', '/demo', '/fonctionnalites', '/tarifs'];
// Auth routes (redirect if already logged in)
const AUTH_ROUTES = ['/login', '/forgot-password', '/staff/login'];

// Routes staff-only (admin/manager/commercial/livreur)
const STAFF_ROUTES = [
  '/dashboard',
  '/clients',
  '/tracking',
  '/devis',
  '/anti-churn',
  '/assistant',
  '/chat',
  '/prospection',
  '/scan-menu',
  '/stocks',
  '/supervision',
  '/tournees',
  '/equipe',
  '/staff',
];

/**
 * Decode a Firebase session cookie (JWT) payload without signature verification.
 * Security: __session is httpOnly + signed by Firebase Admin — can't be forged.
 * Full verification happens in API routes via getAdminAuth().verifySessionCookie().
 * Middleware uses this ONLY for routing decisions (UX), not data access.
 */
function decodeSessionCookie(cookie: string): {
  uid?: string;
  role?: string;
  depot?: string;
  staff?: boolean;
} | null {
  try {
    const parts = cookie.split('.');
    if (parts.length !== 3) return null;
    // Base64url decode the payload
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    const payload = JSON.parse(json);
    // Check expiry
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return {
      uid: payload.sub as string | undefined,
      role: payload.role as string | undefined,
      depot: payload.depot as string | undefined,
      staff: payload.staff as boolean | undefined,
    };
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pass through Next.js internals, assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Public routes — always allow
  if (PUBLIC_ROUTES.some((r) => pathname === r)) {
    return NextResponse.next();
  }

  // Read and decode Firebase session cookie
  const sessionCookie = request.cookies.get('__session')?.value;
  const sessionData = sessionCookie ? decodeSessionCookie(sessionCookie) : null;

  const isAuthenticated = !!sessionData?.uid;
  const userRole = sessionData?.role ?? null;

  // Auth routes: redirect if already authenticated
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    if (isAuthenticated && userRole) {
      const redirect =
        userRole === 'livreur'
          ? '/livraisons'
          : userRole === 'client'
          ? '/commandes'
          : '/dashboard';
      return NextResponse.redirect(new URL(redirect, request.url));
    }
    return NextResponse.next();
  }

  // All other routes require auth
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Guard: /supervision → admin only
  if (pathname.startsWith('/supervision') && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Guard: /equipe → admin/manager only
  if (
    pathname.startsWith('/equipe') &&
    userRole !== 'admin' &&
    userRole !== 'manager'
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Guard: /livraisons → livreur only
  if (pathname.startsWith('/livraisons') && userRole !== 'livreur') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Guard: livreur cannot access staff routes
  if (
    userRole === 'livreur' &&
    STAFF_ROUTES.some((r) => pathname.startsWith(r))
  ) {
    return NextResponse.redirect(new URL('/livraisons', request.url));
  }

  // Guard: client can only access /commandes, /settings, /suivi, /chat
  if (userRole === 'client') {
    const clientAllowed = ['/commandes', '/settings', '/suivi', '/chat'];
    if (!clientAllowed.some((r) => pathname.startsWith(r))) {
      return NextResponse.redirect(new URL('/commandes', request.url));
    }
  }

  // Pass user info via headers for Server Components
  const requestHeaders = new Headers(request.headers);
  if (sessionData?.uid) requestHeaders.set('x-user-uid', sessionData.uid);
  if (userRole) requestHeaders.set('x-user-role', userRole);
  if (sessionData?.depot) requestHeaders.set('x-user-depot', sessionData.depot);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public|icons).*)'],
};
