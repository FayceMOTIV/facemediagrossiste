'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function RootError({
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="text-center max-w-md bg-white rounded-2xl shadow-sm border p-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Oups, une erreur</h2>
        <p className="text-gray-500 mb-6">
          Une erreur inattendue est survenue. Nos équipes ont été notifiées automatiquement.
        </p>
        <Button onClick={reset} className="bg-orange-600 hover:bg-orange-700">
          Réessayer
        </Button>
      </div>
    </div>
  );
}
