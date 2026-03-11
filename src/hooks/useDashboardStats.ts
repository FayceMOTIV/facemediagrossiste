'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { COLLECTIONS } from '@/services/firebase/firestore';
import type { DashboardStats } from '@/types';

const DEFAULT_STATS: DashboardStats = {
  caJour: 0,
  caSemaine: 0,
  caMois: 0,
  commandesJour: 0,
  commandesSemaine: 0,
  clientsActifs: 0,
  clientsARisque: 0,
  livraisonsEnCours: 0,
  alertesCritiques: 0,
  tauxConversion: 0,
  panierMoyen: 0,
};

export function useDashboardStats(depot?: string) {
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const tsDay = Timestamp.fromDate(startOfDay);
    const tsWeek = Timestamp.fromDate(startOfWeek);
    const tsMonth = Timestamp.fromDate(startOfMonth);

    // Contraintes dépôt optionnel
    const depotConstraints = depot ? [where('depot', '==', depot)] : [];

    // --- Commandes ---
    const ordersQuery = query(
      collection(db, COLLECTIONS.ORDERS),
      ...depotConstraints,
      where('createdAt', '>=', tsMonth)
    );

    const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
      const orders = snapshot.docs.map(d => d.data());

      const commandesJour = orders.filter(o => (o.createdAt as Timestamp).toDate() >= startOfDay).length;
      const commandesSemaine = orders.filter(o => (o.createdAt as Timestamp).toDate() >= startOfWeek).length;

      const livreesMonth = orders.filter(o => o.status === 'livree');
      const brouillons = orders.filter(o => o.status === 'brouillon');

      const caJour = orders
        .filter(o => (o.createdAt as Timestamp).toDate() >= startOfDay && o.status !== 'annulee')
        .reduce((sum, o) => sum + (o.totalTTC ?? 0), 0);

      const caSemaine = orders
        .filter(o => (o.createdAt as Timestamp).toDate() >= startOfWeek && o.status !== 'annulee')
        .reduce((sum, o) => sum + (o.totalTTC ?? 0), 0);

      const caMois = livreesMonth.reduce((sum, o) => sum + (o.totalTTC ?? 0), 0);

      const panierMoyen = livreesMonth.length > 0
        ? Math.round(caMois / livreesMonth.length)
        : 0;

      const tauxConversion = (orders.length - brouillons.length) > 0
        ? Math.round(((livreesMonth.length) / (orders.length - brouillons.length)) * 100)
        : 0;

      setStats(prev => ({
        ...prev,
        caJour,
        caSemaine,
        caMois,
        commandesJour,
        commandesSemaine,
        panierMoyen,
        tauxConversion,
      }));
    });

    // --- Clients ---
    const clientsQuery = query(
      collection(db, COLLECTIONS.CLIENTS),
      ...depotConstraints
    );

    const unsubClients = onSnapshot(clientsQuery, (snapshot) => {
      const clients = snapshot.docs.map(d => d.data());
      const clientsActifs = clients.filter(c => c.status === 'actif').length;
      const clientsARisque = clients.filter(c => c.riskScore >= 70 && c.status === 'actif').length;

      setStats(prev => ({ ...prev, clientsActifs, clientsARisque }));
    });

    // --- Livraisons en cours ---
    const livraisonsQuery = query(
      collection(db, COLLECTIONS.DELIVERIES),
      ...depotConstraints,
      where('status', 'in', ['planifiee', 'en_route', 'arrivee'])
    );

    const unsubLivraisons = onSnapshot(livraisonsQuery, (snapshot) => {
      setStats(prev => ({ ...prev, livraisonsEnCours: snapshot.size }));
    });

    // --- Alertes critiques ---
    const alertsQuery = query(
      collection(db, COLLECTIONS.ALERTS),
      where('status', 'in', ['nouvelle', 'vue']),
      where('priority', '==', 'critique')
    );

    const unsubAlerts = onSnapshot(alertsQuery, (snapshot) => {
      setStats(prev => ({ ...prev, alertesCritiques: snapshot.size }));
      setLoading(false);
    });

    return () => {
      unsubOrders();
      unsubClients();
      unsubLivraisons();
      unsubAlerts();
    };
  }, [depot]);

  return { stats, loading };
}
