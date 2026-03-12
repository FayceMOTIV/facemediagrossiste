import { useState, useEffect, useRef, useCallback } from 'react';
import * as Location from 'expo-location';
import { ref, set, onDisconnect } from 'firebase/database';
import { realtimeDb } from '@/services/firebase';

export interface Position {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: number;
}

const TRACKING_INTERVAL_MS = 10_000; // 10 secondes

export function useTracking(uid: string | null) {
  const [isTracking, setIsTracking] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const publishPosition = useCallback(
    async (pos: Position) => {
      if (!uid) return;
      const posRef = ref(realtimeDb, `positions/${uid}`);
      await set(posRef, {
        lat: pos.lat,
        lng: pos.lng,
        accuracy: pos.accuracy ?? null,
        timestamp: pos.timestamp,
        online: true,
      });
    },
    [uid]
  );

  const startTracking = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setError('Permission de localisation refusée');
      return;
    }

    // Set online presence and auto-disconnect handler
    if (uid) {
      const posRef = ref(realtimeDb, `positions/${uid}`);
      onDisconnect(posRef).update({ online: false });
    }

    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 20, // update every 20m
      },
      (loc) => {
        const pos: Position = {
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
          accuracy: loc.coords.accuracy ?? undefined,
          timestamp: loc.timestamp,
        };
        setPosition(pos);
      }
    );

    // Publish to Firebase every TRACKING_INTERVAL_MS
    intervalRef.current = setInterval(() => {
      setPosition(current => {
        if (current) publishPosition(current);
        return current;
      });
    }, TRACKING_INTERVAL_MS);

    setIsTracking(true);
    setError(null);
  }, [uid, publishPosition]);

  const stopTracking = useCallback(() => {
    watchRef.current?.remove();
    if (intervalRef.current) clearInterval(intervalRef.current);
    watchRef.current = null;
    intervalRef.current = null;
    setIsTracking(false);

    if (uid) {
      const posRef = ref(realtimeDb, `positions/${uid}`);
      set(posRef, { online: false, timestamp: Date.now() });
    }
  }, [uid]);

  // Auto-stop on unmount
  useEffect(() => {
    return () => stopTracking();
  }, [stopTracking]);

  return { isTracking, position, error, startTracking, stopTracking };
}
