'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection, query, where, orderBy, onSnapshot,
  updateDoc, doc, Timestamp,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import type { Product } from '@/types';

export interface StockItem extends Product {
  stockActuel: number;
  stockMinimum: number;
  valeurStock: number;
  urgence: 'critique' | 'faible' | 'normal' | 'surplus';
}

function computeUrgence(actuel: number, minimum: number): StockItem['urgence'] {
  if (actuel === 0) return 'critique';
  if (actuel <= minimum * 0.5) return 'critique';
  if (actuel <= minimum) return 'faible';
  if (actuel > minimum * 3) return 'surplus';
  return 'normal';
}

export function useStocks(depot?: string) {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const constraints: QueryConstraint[] = [];
    if (depot) constraints.push(where('depot', '==', depot));
    constraints.push(orderBy('nom'));

    const q = query(collection(db, 'products'), ...constraints);
    const unsub = onSnapshot(q, (snap) => {
      const items: StockItem[] = snap.docs.map(d => {
        const data = d.data() as Product;
        const actuel = data.stockActuel ?? 0;
        const minimum = data.stockMinimum ?? 10;
        return {
          ...data,
          id: d.id,
          stockActuel: actuel,
          stockMinimum: minimum,
          valeurStock: actuel * data.prix,
          urgence: computeUrgence(actuel, minimum),
        };
      });
      setStocks(items);
      setLoading(false);
    });
    return unsub;
  }, [depot]);

  const updateStock = useCallback(async (productId: string, newStock: number) => {
    await updateDoc(doc(db, 'products', productId), {
      stockActuel: newStock,
      updatedAt: Timestamp.now(),
    });
  }, []);

  const getStats = useCallback(() => {
    const critiques = stocks.filter(s => s.urgence === 'critique');
    const faibles = stocks.filter(s => s.urgence === 'faible');
    const valeurTotale = stocks.reduce((s, item) => s + item.valeurStock, 0);
    return {
      total: stocks.length,
      critiques: critiques.length,
      faibles: faibles.length,
      valeurTotale,
      aCommander: critiques.length + faibles.length,
    };
  }, [stocks]);

  return { stocks, loading, updateStock, getStats };
}
