export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';
import { z } from 'zod';

const SessionSchema = z.object({ idToken: z.string().min(1) });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idToken } = SessionSchema.parse(body);

    const adminAuth = getAdminAuth();

    // Verify the ID token
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    const uid = decodedToken.uid;

    // Check if role is already in custom claims
    let role = decodedToken['role'] as string | undefined;
    let depot = decodedToken['depot'] as string | undefined;
    let staff = decodedToken['staff'] as boolean | undefined;

    if (!role) {
      // Read role from Firestore and set custom claims
      const db = getAdminDb();
      const userDoc = await db.collection('users').doc(uid).get();

      if (!userDoc.exists) {
        return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
      }

      const userData = userDoc.data()!;
      role = (userData.role as string) ?? 'client';
      depot = userData.depot as string | undefined;
      staff = ['admin', 'manager', 'commercial', 'livreur'].includes(role);

      // Set custom claims so future tokens will include them
      await adminAuth.setCustomUserClaims(uid, { role, depot, staff });

      // Tell client to refresh their ID token (new claims won't be in current token)
      return NextResponse.json({ needsRefresh: true, role }, { status: 200 });
    }

    // Create session cookie (14 days)
    const expiresIn = 60 * 60 * 24 * 14 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ role });
    response.cookies.set('__session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 14,
    });

    return response;
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  return POST(req);
}
