'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      import('@sentry/nextjs').then(({ captureException }) => {
        captureException(error);
      }).catch(() => {});
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Page temporairement indisponible</h2>
        <p className="text-gray-500 text-sm mb-6">
          Cette page rencontre un problème. Nos équipes ont été automatiquement notifiées.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} className="bg-orange-600 hover:bg-orange-700 gap-2">
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
            Retour au dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
