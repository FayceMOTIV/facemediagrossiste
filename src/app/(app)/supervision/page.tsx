'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NumberTicker } from '@/components/ui/number-ticker';
import { ShineBorder } from '@/components/ui/shine-border';
import { AnimatedList } from '@/components/ui/animated-list';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useAuth } from '@/hooks/useAuth';
import { subscribeToCollection, COLLECTIONS } from '@/services/firebase/firestore';
import { DEPOTS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import type { Alert, Client } from '@/types';
import {
  Users,
  Truck,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  RefreshCw,
  ChevronRight,
  Target,
  Euro,
  Building2,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';

type DepotId = 'tous' | 'lyon' | 'montpellier' | 'bordeaux';

const DEPOT_OPTIONS: { id: DepotId; name: string }[] = [
  { id: 'tous', name: 'Tous les dépôts' },
  ...DEPOTS.map(d => ({ id: d.id as DepotId, name: d.name })),
];

export default function SupervisionPage() {
  const { isAdmin, isManager } = useAuth();
  const [selectedDepot, setSelectedDepot] = useState<DepotId>('tous');
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [criticalClients, setCriticalClients] = useState<Client[]>([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const depotFilter = selectedDepot === 'tous' ? undefined : selectedDepot;
  const { stats, loading } = useDashboardStats(depotFilter);

  // Subscribe to real-time alerts
  useEffect(() => {
    const unsub = subscribeToCollection<Alert>(
      COLLECTIONS.ALERTS,
      (data) => {
        const active = data
          .filter(a => a.status === 'nouvelle' || a.status === 'vue')
          .sort((a, b) => {
            const priorityOrder = { critique: 0, haute: 1, moyenne: 2, basse: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          });
        setAlerts(active);
      },
      [
        { field: 'status', operator: 'in', value: ['nouvelle', 'vue'] },
      ]
    );
    return () => unsub();
  }, []);

  // Subscribe to critical clients (riskScore >= 70)
  useEffect(() => {
    const constraints: { field: string; operator: string; value: unknown }[] = [
      { field: 'riskScore', operator: '>=', value: 70 },
      { field: 'status', operator: '==', value: 'actif' },
    ];
    if (selectedDepot !== 'tous') {
      constraints.push({ field: 'depot', operator: '==', value: selectedDepot });
    }

    const unsub = subscribeToCollection<Client>(
      COLLECTIONS.CLIENTS,
      (data) => {
        const sorted = data.sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);
        setCriticalClients(sorted);
      },
      constraints
    );
    return () => unsub();
  }, [selectedDepot]);

  const handleRefresh = useCallback(() => {
    setLastRefresh(new Date());
  }, []);

  // Calculate derived values
  const progressPercent = Math.min(100, Math.round((stats.caJour / 25000) * 100));
  const objectifJour = 25000;

  // Only admin and manager can see this page
  if (!isAdmin && !isManager) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Accès restreint</h2>
            <p className="text-gray-500">Cette page est réservée aux administrateurs et managers.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Supervision"
        subtitle="Vue temps réel de votre activité"
      />

      <div className="p-6">
        {/* Depot + Period selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          {/* Depot selector - admin only sees all */}
          <div className="flex flex-wrap gap-2">
            {DEPOT_OPTIONS.map((depot) => (
              <Button
                key={depot.id}
                variant={selectedDepot === depot.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDepot(depot.id)}
                className={selectedDepot === depot.id ? 'bg-orange-600 hover:bg-orange-700' : ''}
              >
                <Building2 className="w-3 h-3 mr-1" />
                {depot.name}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[
                { id: 'today', label: "Aujourd'hui" },
                { id: 'week', label: 'Semaine' },
                { id: 'month', label: 'Mois' },
              ].map((period) => (
                <Button
                  key={period.id}
                  variant={selectedPeriod === period.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPeriod(period.id)}
                  className={selectedPeriod === period.id ? 'bg-gray-800 hover:bg-gray-900' : ''}
                >
                  {period.label}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">
                {lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </Button>
          </div>
        </div>

        {/* Live KPI stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Euro className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    <NumberTicker
                      value={
                        selectedPeriod === 'today'
                          ? stats.caJour
                          : selectedPeriod === 'week'
                          ? stats.caSemaine
                          : stats.caMois
                      }
                      prefix="€"
                      decimalPlaces={0}
                    />
                  </p>
                  <p className="text-sm text-gray-500">
                    CA {selectedPeriod === 'today' ? 'du jour' : selectedPeriod === 'week' ? 'semaine' : 'du mois'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    <NumberTicker
                      value={
                        selectedPeriod === 'today'
                          ? stats.commandesJour
                          : stats.commandesSemaine
                      }
                    />
                  </p>
                  <p className="text-sm text-gray-500">
                    Commandes {selectedPeriod === 'today' ? 'du jour' : 'semaine'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    <NumberTicker value={stats.clientsActifs} />
                  </p>
                  <p className="text-sm text-gray-500">Clients actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    <NumberTicker value={stats.livraisonsEnCours} />
                  </p>
                  <p className="text-sm text-gray-500">Livraisons en cours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700 font-medium">Taux de conversion</p>
                  <p className="text-3xl font-bold text-orange-800 mt-1">
                    <NumberTicker value={stats.tauxConversion} suffix="%" />
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Panier moyen</p>
                  <p className="text-3xl font-bold text-blue-800 mt-1">
                    <NumberTicker value={stats.panierMoyen} prefix="€" />
                  </p>
                </div>
                <Euro className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700 font-medium">Clients à risque</p>
                  <p className="text-3xl font-bold text-red-800 mt-1">
                    <NumberTicker value={stats.clientsARisque} />
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress to goal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-600" />
                  Objectif du jour
                  {loading && (
                    <span className="text-xs text-gray-400 font-normal ml-2">Chargement...</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(stats.caJour)}
                    </span>
                    <span className="text-gray-500">
                      / {formatCurrency(objectifJour)}
                    </span>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-1000"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {progressPercent}% atteint
                    </span>
                    <span className="text-orange-600 font-medium">
                      {formatCurrency(Math.max(0, objectifJour - stats.caJour))} restant
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Critical clients with ShineBorder */}
            {criticalClients.length > 0 && (
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <ShieldAlert className="w-5 h-5" />
                    Clients critiques ({criticalClients.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {criticalClients.map((client) => (
                    <ShineBorder
                      key={client.id}
                      color={['#ef4444', '#dc2626', '#b91c1c']}
                      borderRadius={8}
                      duration={4}
                    >
                      <div className="p-3 bg-white rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{client.nom}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              <span>{client.ville}</span>
                              <span>•</span>
                              <span className="capitalize">{client.type}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-red-100 text-red-800 mb-1">
                              Risque {client.riskScore}%
                            </Badge>
                            <p className="text-xs text-gray-500">{formatCurrency(client.caAnnuel)}/an</p>
                          </div>
                        </div>
                      </div>
                    </ShineBorder>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Livraisons progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-green-600" />
                  Livraisons en cours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#22C55E"
                        strokeWidth="3"
                        strokeDasharray={`${stats.livraisonsEnCours > 0 ? 60 : 0}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-gray-900">{stats.livraisonsEnCours}</p>
                        <p className="text-xs text-gray-500">actives</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-green-600">
                      <NumberTicker value={stats.commandesJour} />
                    </p>
                    <p className="text-xs text-gray-500">Commandes today</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-orange-600">
                      <NumberTicker value={stats.livraisonsEnCours} />
                    </p>
                    <p className="text-xs text-gray-500">En route</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Alertes with AnimatedList */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="w-5 h-5" />
                  Alertes ({alerts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {alerts.length === 0 ? (
                  <div className="text-center py-6 text-gray-400">
                    <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-400" />
                    <p className="text-sm">Aucune alerte active</p>
                  </div>
                ) : (
                  <AnimatedList
                    items={alerts}
                    keyExtractor={(alert) => alert.id}
                    renderItem={(alerte) => (
                      <div
                        className={`p-3 rounded-lg ${
                          alerte.priority === 'critique' ? 'bg-red-50 border border-red-200' :
                          alerte.priority === 'haute' ? 'bg-orange-50 border border-orange-200' :
                          'bg-yellow-50 border border-yellow-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-gray-900">{alerte.message}</p>
                          <Badge
                            className={
                              alerte.priority === 'critique'
                                ? 'bg-red-100 text-red-800 shrink-0'
                                : alerte.priority === 'haute'
                                ? 'bg-orange-100 text-orange-800 shrink-0'
                                : 'bg-yellow-100 text-yellow-800 shrink-0'
                            }
                          >
                            {alerte.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 capitalize">{alerte.type}</p>
                      </div>
                    )}
                    maxVisible={8}
                  />
                )}
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Voir toutes les alertes
                </Button>
              </CardContent>
            </Card>

            {/* Quick stats per depot */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-600" />
                  Dépôt sélectionné
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">
                    {DEPOT_OPTIONS.find(d => d.id === selectedDepot)?.name}
                  </p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <p className="text-xs text-gray-500">Clients actifs</p>
                      <p className="text-lg font-bold text-gray-900">
                        <NumberTicker value={stats.clientsActifs} />
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Alertes critiques</p>
                      <p className="text-lg font-bold text-red-600">
                        <NumberTicker value={stats.alertesCritiques} />
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Users className="w-4 h-4" />
                  Envoyer notification équipe
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Truck className="w-4 h-4" />
                  Réaffecter livraison
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Package className="w-4 h-4" />
                  Créer commande urgente
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Rapport journalier
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
