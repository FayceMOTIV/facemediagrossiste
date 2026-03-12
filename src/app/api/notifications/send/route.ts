export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getMessaging } from 'firebase-admin/messaging';
import { getAdminAuth } from '@/lib/firebase-admin';
import { z } from 'zod';

const NotificationSchema = z.object({
  token: z.string(),
  title: z.string(),
  body: z.string(),
  data: z.record(z.string()).optional(),
  url: z.string().optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Verify admin or manager role via Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.slice(7);
    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(token);
    if (!['admin', 'manager'].includes((decoded as { role?: string }).role ?? '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json() as unknown;
    const parsed = NotificationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const { token: fcmToken, title, body: notifBody, data, url } = parsed.data;
    const messaging = getMessaging();
    await messaging.send({
      token: fcmToken,
      notification: { title, body: notifBody },
      data: { ...data, url: url ?? '/dashboard' },
      webpush: {
        fcmOptions: { link: url ?? '/dashboard' },
        notification: {
          title,
          body: notifBody,
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-192.png',
        },
      },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Notification send failed' }, { status: 500 });
  }
}
