export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  const sessionCookie = req.cookies.get('__session')?.value;

  const response = NextResponse.json({ success: true });
  response.cookies.set('__session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  if (sessionCookie) {
    try {
      const adminAuth = getAdminAuth();
      const decoded = await adminAuth.verifySessionCookie(sessionCookie, false);
      await adminAuth.revokeRefreshTokens(decoded.sub);
    } catch {
      // Ignore errors — cookie might be expired
    }
  }

  return response;
}
