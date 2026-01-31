'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  Truck,
  AlertTriangle,
  ArrowRight,
  Camera,
  Target,
  Shield,
  Plus
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { DEMO_STATS } from '@/lib/constants';

export default function DashboardPage() {
  const stats = DEMO_STATS;

  const quickActions = [
    { icon: Camera, label: 'Scanner un menu', href: '/scan-menu', color: 'bg-orange-500' },
    { icon: Plus, label: 'Nouvelle commande', href: '/commandes/new', color: 'bg-blue-500' },
    { icon: Target, label: 'Prospecter', href: '/prospection', color: 'bg-green-500' },
    { icon: Shield, label: 'Voir alertes churn', href: '/anti-churn', color: 'bg-red-500' },
  ];

  const recentAlerts = [
    { id: 1, type: 'churn', title: 'Kebab Istanbul - Risque élevé', priority: 'haute', time: 'Il y a 2h' },
    { id: 2, type: 'stock', title: 'Sauce blanche - Stock faible', priority: 'moyenne', time: 'Il y a 3h' },
    { id: 3, type: 'livraison', title: 'Retard livraison - Pizza Roma', priority: 'haute', time: 'Il y a 4h' },
  ];

  const topClients = [
    { id: 1, nom: 'O\'Tacos Lyon 7', ca: 12450, evolution: 15, type: 'tacos' },
    { id: 2, nom: 'Istanbul Kebab', ca: 9870, evolution: -8, type: 'kebab' },
    { id: 3, nom: 'Pizza Napoli', ca: 8540, evolution: 22, type: 'pizza' },
    { id: 4, nom: 'Burger Factory', ca: 7650, evolution: 5, type: 'burger' },
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

      <div className="p-6">
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
              <CardTitle>Top Clients du mois</CardTitle>
              <a href="/clients" className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1">
                Voir tous <ArrowRight className="w-4 h-4" />
              </a>
            </CardHeader>
            <CardContent>
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
                        <p className="text-xs text-gray-500 capitalize">{client.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(client.ca)}
                      </p>
                      <div className={`flex items-center gap-1 text-xs ${
                        client.evolution >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {client.evolution >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {client.evolution >= 0 ? '+' : ''}{client.evolution}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                      <Badge
                        variant={alert.priority === 'haute' ? 'destructive' : 'warning'}
                        className="text-xs"
                      >
                        {alert.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                ))}
              </div>
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
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {formatCurrency(stats.panierMoyen)}
              </p>
              <p className="text-sm text-gray-500">Panier moyen</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {stats.tauxConversion}%
              </p>
              <p className="text-sm text-gray-500">Taux de conversion</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-green-600 mb-1">
                30s
              </p>
              <p className="text-sm text-gray-500">Temps moyen création devis</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
