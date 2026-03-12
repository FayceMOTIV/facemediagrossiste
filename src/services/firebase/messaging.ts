import { getToken, onMessage, type Messaging } from 'firebase/messaging';
import app from './config';

let messagingInstance: Messaging | null = null;

async function getMessaging(): Promise<Messaging | null> {
  if (typeof window === 'undefined') return null;
  if (messagingInstance) return messagingInstance;
  try {
    const { getMessaging: fbGetMessaging } = await import('firebase/messaging');
    messagingInstance = fbGetMessaging(app);
    return messagingInstance;
  } catch {
    return null;
  }
}

export async function requestNotificationPermission(): Promise<string | null> {
  const messaging = await getMessaging();
  if (!messaging) return null;
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    const token = await getToken(messaging, { vapidKey });
    return token;
  } catch {
    return null;
  }
}

export async function onForegroundMessage(
  callback: (payload: { notification?: { title?: string; body?: string }; data?: Record<string, string> }) => void
): Promise<(() => void) | null> {
  const messaging = await getMessaging();
  if (!messaging) return null;
  try {
    const unsubscribe = onMessage(messaging, callback);
    return unsubscribe;
  } catch {
    return null;
  }
}
