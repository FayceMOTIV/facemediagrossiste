'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

export default function LivreurError({
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="text-center">
        <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-gray-900 mb-2">Erreur application</h2>
        <p className="text-gray-500 text-sm mb-4">
          Une erreur est survenue. Vérifiez votre connexion et réessayez.
        </p>
        <Button onClick={reset} className="bg-green-600 hover:bg-green-700">
          Réessayer
        </Button>
      </div>
    </div>
  );
}
