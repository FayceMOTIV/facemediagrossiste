import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { uid: string; disabled: boolean };
    const { uid, disabled } = body;

    if (!uid || typeof disabled !== 'boolean') {
      return NextResponse.json(
        { error: 'uid and disabled (boolean) required' },
        { status: 400 }
      );
    }

    const adminAuth = getAdminAuth();
    await adminAuth.updateUser(uid, { disabled });

    return NextResponse.json({ success: true, uid, disabled });
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la modification du statut.' },
      { status: 500 }
    );
  }
}
