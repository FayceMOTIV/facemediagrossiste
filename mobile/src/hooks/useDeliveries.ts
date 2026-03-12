import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/services/firebase';

export interface DeliveryItem {
  productId: string;
  productRef: string;
  productNom: string;
  quantite: number;
  prixUnitaire: number;
  prixTotal: number;
}

export interface Delivery {
  id: string;
  orderId?: string;
  clientId: string;
  clientNom: string;
  adresse: string;
  coordonnees?: { lat: number; lng: number };
  livreurId: string;
  livreurNom?: string;
  date?: Timestamp;
  creneauPrevu?: string;
  heureArrivee?: Timestamp;
  status: 'planifiee' | 'en_route' | 'arrivee' | 'livree' | 'probleme';
  signature?: string;
  photo?: string;
  notes?: string;
  poidsTotal?: number;
  items?: DeliveryItem[];
  totalTTC?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export function useDeliveries(livreurId: string | null) {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!livreurId) {
      setLoading(false);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, 'deliveries'),
      where('livreurId', '==', livreurId),
      orderBy('createdAt', 'asc')
    );

    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Delivery));
      setDeliveries(docs);
      setLoading(false);
    });

    return unsub;
  }, [livreurId]);

  const updateStatus = useCallback(async (
    deliveryId: string,
    status: Delivery['status'],
    extra?: Partial<Delivery>
  ) => {
    await updateDoc(doc(db, 'deliveries', deliveryId), {
      status,
      ...extra,
      updatedAt: Timestamp.now(),
    });
  }, []);

  const todayDeliveries = deliveries.filter(d => {
    if (!d.date) return true;
    const date = d.date.toDate();
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  });

  return {
    deliveries: todayDeliveries,
    allDeliveries: deliveries,
    loading,
    updateStatus,
  };
}
