'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection, query, where, orderBy, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc, Timestamp,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { COLLECTIONS } from '@/services/firebase/firestore';
import type { Client } from '@/types';

export function useClients(depot?: string) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const constraints: QueryConstraint[] = [];
    if (depot) {
      constraints.push(where('depot', '==', depot));
    }
    constraints.push(orderBy('nom'));

    const q = query(collection(db, COLLECTIONS.CLIENTS), ...constraints);

    const unsub = onSnapshot(q, (snap) => {
      setClients(snap.docs.map(d => ({ id: d.id, ...d.data() } as Client)));
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });
    return unsub;
  }, [depot]);

  const addClient = useCallback(async (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addDoc(collection(db, COLLECTIONS.CLIENTS), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }, []);

  const updateClient = useCallback(async (id: string, data: Partial<Client>) => {
    await updateDoc(doc(db, COLLECTIONS.CLIENTS, id), {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }, []);

  const deleteClient = useCallback(async (id: string) => {
    await deleteDoc(doc(db, COLLECTIONS.CLIENTS, id));
  }, []);

  const getStats = useCallback(() => {
    const actifs = clients.filter(c => c.status === 'actif');
    const aRisque = clients.filter(c => c.riskScore >= 70 && c.status === 'actif');
    const panierMoyen = actifs.length > 0
      ? Math.round(actifs.reduce((s, c) => s + c.panierMoyen, 0) / actifs.length)
      : 0;
    return {
      total: clients.length,
      actifs: actifs.length,
      aRisque: aRisque.length,
      panierMoyen,
    };
  }, [clients]);

  return { clients, loading, error, addClient, updateClient, deleteClient, getStats };
}
