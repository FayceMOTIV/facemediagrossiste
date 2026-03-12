'use client';

import { useState, useEffect, useCallback } from 'react';
import { requestNotificationPermission, onForegroundMessage } from '@/services/firebase/messaging';

interface NotificationState {
  permission: NotificationPermission;
  token: string | null;
  supported: boolean;
}

export function useNotifications() {
  const [state, setState] = useState<NotificationState>({
    permission: 'default',
    token: null,
    supported: false,
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setState(prev => ({ ...prev, permission: Notification.permission, supported: true }));
    }
  }, []);

  const requestPermission = useCallback(async () => {
    const token = await requestNotificationPermission();
    if (token) {
      setState(prev => ({ ...prev, permission: 'granted', token }));
    } else {
      setState(prev => ({
        ...prev,
        permission: typeof window !== 'undefined' && 'Notification' in window
          ? Notification.permission
          : 'denied',
      }));
    }
    return token;
  }, []);

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    onForegroundMessage((payload) => {
      const title = payload.notification?.title ?? 'FastGross Pro';
      const body = payload.notification?.body ?? '';
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/icons/icon-192.png' });
      }
    }).then(unsub => { cleanup = unsub; });
    return () => { if (cleanup) cleanup(); };
  }, []);

  return { ...state, requestPermission };
}
