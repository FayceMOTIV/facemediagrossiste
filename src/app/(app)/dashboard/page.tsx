'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  Truck,
  AlertTriangle,
  ArrowRight,
  Camera,
  Target,
  Shield,
  Plus,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useAuth } from '@/hooks/useAuth';
import { subscribeToCollection, COLLECTIONS } from '@/services/firebase/firestore';
import type { Alert, Client } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const depot = user?.role === 'admin' ? undefined : user?.depot;
  const { stats, loading } = useDashboardStats(depot);

  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [topClients, setTopClients] = useState<Client[]>([]);

  // Alertes temps réel
  useEffect(() => {
    const unsub = subscribeToCollection<Alert>(
      COLLECTIONS.ALERTS,
      (data) => {
        const sorted = data
          .filter(a => a.status === 'nouvelle' || a.status === 'vue')
          .sort((a, b) => {
            const order = { critique: 0, haute: 1, moyenne: 2, basse: 3 };
            return (order[a.priority] ?? 9) - (order[b.priority] ?? 9);
          })
          .slice(0, 5);
        setRecentAlerts(sorted);
      }
    );
    return unsub;
  }, []);

  // Top clients par CA (dernier mois)
  useEffect(() => {
    const constraints = depot ? [{ field: 'depot', operator: '==' as const, value: depot }] : [];
    const unsub = subscribeToCollection<Client>(
      COLLECTIONS.CLIENTS,
      (data) => {
        const actifs = data
          .filter(c => c.status === 'actif')
          .sort((a, b) => b.caAnnuel - a.caAnnuel)
          .slice(0, 4);
        setTopClients(actifs);
      },
      constraints
    );
    return unsub;
  }, [depot]);

  const quickActions = [
    { icon: Camera, label: 'Scanner un menu', href: '/scan-menu', color: 'bg-orange-500' },
    { icon: Plus, label: 'Nouvelle commande', href: '/commandes', color: 'bg-blue-500' },
    { icon: Target, label: 'Prospecter', href: '/prospection', color: 'bg-green-500' },
    { icon: Shield, label: 'Voir alertes churn', href: '/anti-churn', color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        subtitle="Vue d'ensemble de votre activité"
        actions={
          <Button className="bg-orange-600 hover:bg-orange-700 gap-2">
            <Camera className="w-4 h-4" />
            Scanner un menu
          </Button>
        }
      />

      <main id="main-content" className="p-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all group"
            >
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-700 group-hover:text-gray-900">
                {action.label}
              </span>
            </a>
          ))}
        </div>

        {/* Stats Grid */}
        <div role="region" aria-label="Statistiques du tableau de bord" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <Badge variant="success" className="text-xs">+12%</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.caMois)}
              </p>
              <p className="text-sm text-gray-500">CA du mois</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <Badge variant="info" className="text-xs">{stats.commandesJour} aujourd'hui</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(stats.commandesSemaine)}
              </p>
              <p className="text-sm text-gray-500">Commandes cette semaine</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <Badge variant="secondary" className="text-xs">{stats.clientsARisque} à risque</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(stats.clientsActifs)}
              </p>
              <p className="text-sm text-gray-500">Clients actifs</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-orange-600" />
                </div>
                <Badge variant="warning" className="text-xs">En cours</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.livraisonsEnCours}
              </p>
              <p className="text-sm text-gray-500">Livraisons en cours</p>
            </CardContent>
          </Card>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Top Clients */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Top Clients (CA annuel)</CardTitle>
              <a href="/clients" className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1">
                Voir tous <ArrowRight className="w-4 h-4" />
              </a>
            </CardHeader>
            <CardContent>
              {topClients.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">Aucun client actif</p>
              ) : (
                <div className="space-y-4">
                  {topClients.map((client, index) => (
                    <div
                      key={client.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{client.nom}</p>
                          <p className="text-xs text-gray-500 capitalize">{client.type} · {client.ville}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(client.caAnnuel)}
                        </p>
                        <p className="text-xs text-gray-400">{client.frequenceCommande}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Alertes
              </CardTitle>
              <Badge variant="destructive">{stats.alertesCritiques}</Badge>
            </CardHeader>
            <CardContent>
              {recentAlerts.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">Aucune alerte active</p>
              ) : (
                <div className="space-y-3">
                  {recentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                        <Badge
                          variant={alert.priority === 'critique' || alert.priority === 'haute' ? 'destructive' : 'warning'}
                          className="text-xs"
                        >
                          {alert.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{alert.message}</p>
                    </div>
                  ))}
                </div>
              )}
              <a
                href="/anti-churn"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Voir toutes les alertes <ArrowRight className="w-4 h-4" />
              </a>
            </CardContent>
          </Card>
        </div>

        {/* KPIs row */}
        <div role="region" aria-label="Indicateurs de performance clés" className="grid md:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {formatCurrency(stats.panierMoyen)}
              </h3>
              <p className="text-sm text-gray-500">Panier moyen</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {stats.tauxConversion}%
              </h3>
              <p className="text-sm text-gray-500">Taux de conversion</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-3xl font-bold text-green-600 mb-1">
                30s
              </h3>
              <p className="text-sm text-gray-500">Temps moyen création devis</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
