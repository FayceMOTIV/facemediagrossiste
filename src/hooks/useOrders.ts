'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection, query, where, orderBy, onSnapshot,
  addDoc, updateDoc, doc, Timestamp, limit,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { COLLECTIONS } from '@/services/firebase/firestore';
import type { Order } from '@/types';

interface OrderFilters {
  depot?: string;
  livreurId?: string;
  clientId?: string;
  status?: Order['status'];
}

export function useOrders(filters?: OrderFilters) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const constraints: QueryConstraint[] = [];

    if (filters?.depot) constraints.push(where('depot', '==', filters.depot));
    if (filters?.livreurId) constraints.push(where('livreurId', '==', filters.livreurId));
    if (filters?.clientId) constraints.push(where('clientId', '==', filters.clientId));
    if (filters?.status) constraints.push(where('status', '==', filters.status));

    constraints.push(orderBy('createdAt', 'desc'));

    const q = query(collection(db, COLLECTIONS.ORDERS), ...constraints, limit(200));
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      setLoading(false);
    });
    return unsub;
  }, [filters?.depot, filters?.livreurId, filters?.clientId, filters?.status]);

  const createOrder = useCallback(async (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Timestamp.now();
    const ref = await addDoc(collection(db, COLLECTIONS.ORDERS), {
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    return ref.id;
  }, []);

  const updateStatus = useCallback(async (
    orderId: string,
    status: Order['status'],
    extra?: Partial<Order>
  ) => {
    await updateDoc(doc(db, COLLECTIONS.ORDERS, orderId), {
      status,
      ...extra,
      updatedAt: Timestamp.now(),
    });
  }, []);

  const getStats = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const todayOrders = orders.filter(o => {
      const createdAt = o.createdAt as unknown as Timestamp;
      const date = createdAt?.toDate ? createdAt.toDate() : new Date(o.createdAt as unknown as string);
      return date >= today;
    });
    const weekOrders = orders.filter(o => {
      const createdAt = o.createdAt as unknown as Timestamp;
      const date = createdAt?.toDate ? createdAt.toDate() : new Date(o.createdAt as unknown as string);
      return date >= startOfWeek;
    });
    const inProgress = orders.filter(o => ['validee', 'en_preparation', 'en_livraison'].includes(o.status));
    const caSemaine = weekOrders
      .filter(o => o.status !== 'annulee')
      .reduce((s, o) => s + o.totalTTC, 0);

    return {
      aujourd_hui: todayOrders.length,
      en_cours: inProgress.length,
      cette_semaine: weekOrders.length,
      ca_semaine: caSemaine,
    };
  }, [orders]);

  return { orders, loading, createOrder, updateStatus, getStats };
}
