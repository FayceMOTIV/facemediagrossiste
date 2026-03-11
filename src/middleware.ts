import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes publiques (pas besoin d'auth)
const PUBLIC_ROUTES = ['/', '/demo', '/fonctionnalites', '/tarifs'];
const AUTH_ROUTES = ['/login', '/forgot-password'];

// Routes réservées par rôle
const ROLE_ROUTES: Record<string, string[]> = {
  // Admin seulement
  admin: ['/supervision'],
  // Livreur seulement
  livreur: ['/livraisons'],
  // Client seulement
  client: ['/commandes'],
};

// Routes accessibles à admin + manager + commercial
const STAFF_ROUTES = [
  '/dashboard',
  '/clients',
  '/commandes',
  '/tracking',
  '/devis',
  '/anti-churn',
  '/assistant',
  '/chat',
  '/prospection',
  '/scan-menu',
  '/settings',
  '/stocks',
  '/supervision',
  '/tournees',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Laisser passer les routes publiques et assets
  if (
    PUBLIC_ROUTES.some(r => pathname === r) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Lire le cookie de session (role stocké côté client après login)
  const sessionCookie = request.cookies.get('fastgross_session');
  const isAuthenticated = !!sessionCookie?.value;

  let userRole: string | null = null;
  if (sessionCookie?.value) {
    try {
      const session = JSON.parse(atob(sessionCookie.value));
      userRole = session.role ?? null;
    } catch {
      // Cookie invalide → traité comme non authentifié
    }
  }

  // Routes d'auth : rediriger si déjà connecté
  if (AUTH_ROUTES.some(r => pathname.startsWith(r))) {
    if (isAuthenticated && userRole) {
      const redirect = userRole === 'livreur' ? '/livraisons'
        : userRole === 'client' ? '/commandes'
        : '/dashboard';
      return NextResponse.redirect(new URL(redirect, request.url));
    }
    return NextResponse.next();
  }

  // Toute autre route protégée : rediriger si non authentifié
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Guard : /supervision → admin seulement
  if (pathname.startsWith('/supervision') && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Guard : /livraisons → livreur seulement
  if (pathname.startsWith('/livraisons') && userRole !== 'livreur') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Guard : livreur ne peut pas accéder aux routes staff
  if (
    userRole === 'livreur' &&
    STAFF_ROUTES.some(r => pathname.startsWith(r))
  ) {
    return NextResponse.redirect(new URL('/livraisons', request.url));
  }

  // Guard : client ne peut pas accéder aux routes staff (sauf /commandes et /settings)
  if (
    userRole === 'client' &&
    pathname !== '/commandes' &&
    !pathname.startsWith('/commandes') &&
    pathname !== '/settings' &&
    !pathname.startsWith('/settings')
  ) {
    return NextResponse.redirect(new URL('/commandes', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
