export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

// Note: Firebase Admin SDK would be used here in production
// For now, we use Firestore client SDK from service layer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId, status } = body;

    if (!employeeId || !status) {
      return NextResponse.json(
        { error: 'employeeId and status required' },
        { status: 400 }
      );
    }

    if (!['actif', 'suspendu'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Return success - actual update is done via Firestore client SDK
    return NextResponse.json({ success: true, employeeId, status });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
