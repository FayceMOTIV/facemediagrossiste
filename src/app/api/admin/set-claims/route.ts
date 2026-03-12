import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      uid: string;
      role: string;
      depot?: string;
    };
    const { uid, role, depot } = body;

    const validRoles = ['admin', 'manager', 'commercial', 'livreur', 'client'];
    if (!uid || !role || !validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'uid and valid role required' },
        { status: 400 }
      );
    }

    const adminAuth = getAdminAuth();
    await adminAuth.setCustomUserClaims(uid, {
      role,
      ...(depot ? { depot } : {}),
    });

    return NextResponse.json({ success: true, uid, role, depot });
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des claims.' },
      { status: 500 }
    );
  }
}
