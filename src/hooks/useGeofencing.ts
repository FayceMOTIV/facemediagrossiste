'use client';

import { useEffect, useCallback } from 'react';

interface GeofenceTarget {
  id: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  label: string;
}

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const dPhi = ((lat2 - lat1) * Math.PI) / 180;
  const dLambda = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useGeofencing(
  currentPosition: GeolocationCoordinates | null,
  targets: GeofenceTarget[],
  onArrival: (targetId: string, label: string) => void
) {
  const checkGeofences = useCallback(() => {
    if (!currentPosition) return;

    targets.forEach(target => {
      const dist = haversineDistance(
        currentPosition.latitude,
        currentPosition.longitude,
        target.lat,
        target.lng
      );

      if (dist <= target.radiusMeters) {
        onArrival(target.id, target.label);
      }
    });
  }, [currentPosition, targets, onArrival]);

  useEffect(() => {
    checkGeofences();
  }, [checkGeofences]);
}
