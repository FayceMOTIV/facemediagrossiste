'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Users,
  Truck,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  RefreshCw,
  ChevronRight,
  Target,
  Euro
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function SupervisionPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const liveData = {
    commerciauxActifs: 8,
    livreursEnRoute: 5,
    commandesEnCours: 24,
    caJournee: 18500,
    objectifJour: 25000,
    livraisonsTerminees: 18,
    livraisonsRestantes: 12,
    alertes: 3
  };

  const commerciaux = [
    { nom: 'Mohamed K.', status: 'actif', clients: 12, ca: 4500, rdv: 3 },
    { nom: 'Sarah M.', status: 'actif', clients: 8, ca: 3200, rdv: 2 },
    { nom: 'Youssef B.', status: 'pause', clients: 15, ca: 5100, rdv: 4 },
    { nom: 'Fatima R.', status: 'actif', clients: 10, ca: 3800, rdv: 2 },
  ];

  const livreurs = [
    { nom: 'Ahmed D.', status: 'en_route', livraisons: 8, restantes: 4, position: 'Lyon 3' },
    { nom: 'Karim S.', status: 'en_route', livraisons: 6, restantes: 2, position: 'Villeurbanne' },
    { nom: 'Omar T.', status: 'pause', livraisons: 10, restantes: 0, position: 'Dépôt' },
    { nom: 'Rachid M.', status: 'en_route', livraisons: 7, restantes: 5, position: 'Lyon 7' },
  ];

  const alertes = [
    { type: 'churn', message: "Antalya Grill - Score churn 85%", urgence: 'haute', time: '10 min' },
    { type: 'retard', message: "Livraison Pizza Napoli - Retard 30 min", urgence: 'moyenne', time: '25 min' },
    { type: 'stock', message: "Rupture imminente broches kebab", urgence: 'haute', time: '1h' },
  ];

  return (
    <div className="min-h-screen">
      <Header
        title="Supervision"
        subtitle="Vue temps réel de votre activité"
      />

      <div className="p-6">
        {/* Period selector */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {[
              { id: 'today', label: "Aujourd'hui" },
              { id: 'week', label: 'Cette semaine' },
              { id: 'month', label: 'Ce mois' },
            ].map((period) => (
              <Button
                key={period.id}
                variant={selectedPeriod === period.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period.id)}
                className={selectedPeriod === period.id ? 'bg-orange-600 hover:bg-orange-700' : ''}
              >
                {period.label}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </Button>
        </div>

        {/* Live stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{liveData.commerciauxActifs}</p>
                  <p className="text-sm text-gray-500">Commerciaux actifs</p>
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
                  <p className="text-2xl font-bold text-gray-900">{liveData.livreursEnRoute}</p>
                  <p className="text-sm text-gray-500">Livreurs en route</p>
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
                  <p className="text-2xl font-bold text-gray-900">{liveData.commandesEnCours}</p>
                  <p className="text-sm text-gray-500">Commandes en cours</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Euro className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(liveData.caJournee)}</p>
                  <p className="text-sm text-gray-500">CA du jour</p>
                </div>
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
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(liveData.caJournee)}
                    </span>
                    <span className="text-gray-500">
                      / {formatCurrency(liveData.objectifJour)}
                    </span>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
                      style={{ width: `${(liveData.caJournee / liveData.objectifJour) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {Math.round((liveData.caJournee / liveData.objectifJour) * 100)}% atteint
                    </span>
                    <span className="text-orange-600 font-medium">
                      {formatCurrency(liveData.objectifJour - liveData.caJournee)} restant
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Commerciaux */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Équipe commerciale
                </CardTitle>
                <Button variant="ghost" size="sm" className="gap-1">
                  Voir tout <ChevronRight className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {commerciaux.map((commercial, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-bold text-blue-600">
                            {commercial.nom.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{commercial.nom}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{commercial.clients} clients</span>
                            <span>•</span>
                            <span>{commercial.rdv} RDV</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(commercial.ca)}</p>
                        <Badge
                          className={commercial.status === 'actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                        >
                          {commercial.status === 'actif' ? 'Actif' : 'Pause'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Livreurs */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-green-600" />
                  Flotte de livraison
                </CardTitle>
                <Button variant="ghost" size="sm" className="gap-1">
                  Carte <ChevronRight className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {livreurs.map((livreur, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Truck className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{livreur.nom}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>{livreur.position}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          <span className="font-bold text-gray-900">{livreur.livraisons - livreur.restantes}</span>
                          <span className="text-gray-500">/{livreur.livraisons}</span>
                        </p>
                        <Badge
                          className={livreur.status === 'en_route' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}
                        >
                          {livreur.status === 'en_route' ? 'En route' : 'Au dépôt'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Livraisons progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Livraisons du jour</CardTitle>
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
                        strokeDasharray={`${(liveData.livraisonsTerminees / (liveData.livraisonsTerminees + liveData.livraisonsRestantes)) * 100}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-gray-900">{liveData.livraisonsTerminees}</p>
                        <p className="text-xs text-gray-500">/{liveData.livraisonsTerminees + liveData.livraisonsRestantes}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-green-600">{liveData.livraisonsTerminees}</p>
                    <p className="text-xs text-gray-500">Terminées</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-orange-600">{liveData.livraisonsRestantes}</p>
                    <p className="text-xs text-gray-500">Restantes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alertes */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="w-5 h-5" />
                  Alertes ({alertes.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alertes.map((alerte, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      alerte.urgence === 'haute' ? 'bg-red-50' : 'bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900">{alerte.message}</p>
                      <Badge
                        className={
                          alerte.urgence === 'haute'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {alerte.urgence}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Il y a {alerte.time}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  Voir toutes les alertes
                </Button>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
