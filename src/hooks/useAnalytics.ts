'use client';

import { useCallback } from 'react';

type EventName =
  | 'scan_menu'
  | 'commande_passee'
  | 'agent_ia_utilise'
  | 'devis_genere'
  | 'client_cree'
  | 'tracking_gps_active'
  | 'churn_analyse'
  | 'pdf_genere'
  | 'login'
  | 'logout';

export function useAnalytics() {
  const track = useCallback((event: EventName, properties?: Record<string, unknown>) => {
    try {
      // Dynamic import to avoid SSR issues
      import('posthog-js').then(({ default: posthog }) => {
        posthog.capture(event, properties);
      }).catch(() => {});
    } catch {
      // Silently fail if PostHog is not available
    }
  }, []);

  const identify = useCallback((userId: string, traits?: Record<string, unknown>) => {
    try {
      import('posthog-js').then(({ default: posthog }) => {
        posthog.identify(userId, traits);
      }).catch(() => {});
    } catch {} // eslint-disable-line no-empty
  }, []);

  return { track, identify };
}
