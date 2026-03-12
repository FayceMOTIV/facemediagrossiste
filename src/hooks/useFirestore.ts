'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getAll,
  getById,
  create,
  update,
  remove,
  subscribeToCollection,
  COLLECTIONS
} from '@/services/firebase/firestore';
import type { WhereFilterOp } from 'firebase/firestore';

interface UseFirestoreState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

interface UseFirestoreOptions {
  realtime?: boolean;
  filters?: { field: string; operator: WhereFilterOp; value: unknown }[];
}

export function useFirestoreCollection<T>(
  collectionName: string,
  options: UseFirestoreOptions = {}
) {
  const [state, setState] = useState<UseFirestoreState<T>>({
    data: [],
    loading: true,
    error: null,
  });

  const { realtime = false, filters } = options;

  useEffect(() => {
    if (realtime) {
      // Mode temps réel avec listener
      const unsubscribe = subscribeToCollection<T>(
        collectionName,
        (data) => {
          setState({ data, loading: false, error: null });
        },
        filters
      );
      return () => unsubscribe();
    } else {
      // Mode one-shot
      const fetchData = async () => {
        try {
          const data = await getAll<T>(collectionName);
          setState({ data, loading: false, error: null });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Une erreur est survenue';
          setState({ data: [], loading: false, error: message });
        }
      };
      fetchData();
    }
  }, [collectionName, realtime, JSON.stringify(filters)]);

  const refresh = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const data = await getAll<T>(collectionName);
      setState({ data, loading: false, error: null });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      setState(prev => ({ ...prev, loading: false, error: message }));
    }
  }, [collectionName]);

  const add = useCallback(async (data: Omit<T, 'id'>) => {
    try {
      const id = await create(collectionName, data as Record<string, unknown>);
      if (!realtime) await refresh();
      return id;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      throw new Error(message);
    }
  }, [collectionName, realtime, refresh]);

  const updateItem = useCallback(async (id: string, data: Partial<T>) => {
    try {
      await update(collectionName, id, data as Record<string, unknown>);
      if (!realtime) await refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      throw new Error(message);
    }
  }, [collectionName, realtime, refresh]);

  const deleteItem = useCallback(async (id: string) => {
    try {
      await remove(collectionName, id);
      if (!realtime) await refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      throw new Error(message);
    }
  }, [collectionName, realtime, refresh]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    refresh,
    add,
    update: updateItem,
    delete: deleteItem,
  };
}

export function useFirestoreDocument<T>(collectionName: string, docId: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!docId) {
      setData(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const doc = await getById<T>(collectionName, docId);
        setData(doc);
        setError(null);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Une erreur est survenue';
        setError(message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, docId]);

  const updateDoc = useCallback(async (data: Partial<T>) => {
    if (!docId) return;
    try {
      await update(collectionName, docId, data as Record<string, unknown>);
      setData(prev => prev ? { ...prev, ...data } : null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      throw new Error(message);
    }
  }, [collectionName, docId]);

  const deleteDoc = useCallback(async () => {
    if (!docId) return;
    try {
      await remove(collectionName, docId);
      setData(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      throw new Error(message);
    }
  }, [collectionName, docId]);

  return { data, loading, error, update: updateDoc, delete: deleteDoc };
}

// Hook spécialisé pour les clients
export function useClients(options?: UseFirestoreOptions) {
  return useFirestoreCollection<Record<string, unknown>>(COLLECTIONS.CLIENTS, options);
}

// Hook spécialisé pour les commandes
export function useOrders(options?: UseFirestoreOptions) {
  return useFirestoreCollection<Record<string, unknown>>(COLLECTIONS.ORDERS, options);
}

// Hook spécialisé pour les produits
export function useProducts(options?: UseFirestoreOptions) {
  return useFirestoreCollection<Record<string, unknown>>(COLLECTIONS.PRODUCTS, options);
}

// Hook spécialisé pour les alertes
export function useAlerts(options?: UseFirestoreOptions) {
  return useFirestoreCollection<Record<string, unknown>>(COLLECTIONS.ALERTS, { realtime: true, ...options });
}
