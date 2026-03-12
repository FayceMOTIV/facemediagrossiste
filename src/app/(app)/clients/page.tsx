'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Plus,
  Download,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Loader2,
  Users,
} from 'lucide-react';
import { formatCurrency, clientTypeColors, getRiskLevel, riskLevelColors } from '@/lib/utils';
import { useClients } from '@/hooks/useClients';
import { useAuth } from '@/hooks/useAuth';
import type { Client } from '@/types';

type StatusFilter = 'tous' | 'actif' | 'inactif' | 'arisque';
type DepotFilter = 'tous' | 'lyon' | 'montpellier' | 'bordeaux';

export default function ClientsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'manager';
  const depotPrefill = isAdmin ? undefined : (user?.depot ?? undefined);

  const { clients, loading, error, getStats } = useClients(depotPrefill);
  const stats = getStats();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('tous');
  const [depotFilter, setDepotFilter] = useState<DepotFilter>('tous');

  const filteredClients = clients.filter((client) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      client.nom.toLowerCase().includes(term) ||
      client.ville.toLowerCase().includes(term) ||
      client.type.toLowerCase().includes(term);

    const matchStatus =
      statusFilter === 'tous' ||
      (statusFilter === 'actif' && client.status === 'actif') ||
      (statusFilter === 'inactif' && client.status === 'inactif') ||
      (statusFilter === 'arisque' && client.riskScore >= 70);

    const matchDepot =
      !isAdmin ||
      depotFilter === 'tous' ||
      client.depot === depotFilter;

    return matchSearch && matchStatus && matchDepot;
  });

  const statusButtons: { key: StatusFilter; label: string }[] = [
    { key: 'tous', label: 'Tous' },
    { key: 'actif', label: 'Actifs' },
    { key: 'inactif', label: 'Inactifs' },
    { key: 'arisque', label: 'À risque' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Clients" subtitle="Chargement..." />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header title="Clients" subtitle="Erreur" />
        <div className="p-6">
          <Card>
            <CardContent className="p-6 text-center text-red-600">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
              <p>{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Clients"
        subtitle={`${stats.total} client${stats.total !== 1 ? 's' : ''}`}
        actions={
          <Button className="bg-orange-600 hover:bg-orange-700 gap-2">
            <Plus className="w-4 h-4" />
            Nouveau client
          </Button>
        }
      />

      <main id="main-content" className="p-6">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total clients</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.actifs}</p>
              <p className="text-sm text-gray-500">Actifs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.aRisque}</p>
              <p className="text-sm text-gray-500">À risque</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.panierMoyen)}
              </p>
              <p className="text-sm text-gray-500">Panier moyen</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div role="search" className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
            <Input
              type="search"
              placeholder="Rechercher un client..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Rechercher un client"
            />
          </div>

          <div className="flex gap-1">
            {statusButtons.map((btn) => (
              <Button
                key={btn.key}
                variant={statusFilter === btn.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(btn.key)}
                className={statusFilter === btn.key ? 'bg-orange-600 hover:bg-orange-700' : ''}
              >
                {btn.label}
              </Button>
            ))}
          </div>

          {isAdmin && (
            <select
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={depotFilter}
              onChange={(e) => setDepotFilter(e.target.value as DepotFilter)}
            >
              <option value="tous">Tous les dépôts</option>
              <option value="lyon">Lyon</option>
              <option value="montpellier">Montpellier</option>
              <option value="bordeaux">Bordeaux</option>
            </select>
          )}

          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </div>

        {/* Clients table */}
        <Card>
          <CardContent className="p-0">
            {filteredClients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <Users className="w-12 h-12 mb-3 text-gray-300" />
                <p className="text-base font-medium">Aucun client trouvé</p>
                <p className="text-sm">Modifiez vos filtres ou ajoutez un nouveau client.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CA Annuel
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fréquence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Panier moyen
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Risque
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dépôt
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClients.map((client: Client) => {
                      const riskLevel = getRiskLevel(client.riskScore);
                      const isHigh = client.riskScore >= 61;
                      const isMed = client.riskScore >= 31 && client.riskScore < 61;
                      const riskColor = isHigh
                        ? 'bg-red-100 text-red-800'
                        : isMed
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800';

                      const statusColorMap: Record<Client['status'], string> = {
                        actif: 'bg-green-100 text-green-800',
                        inactif: 'bg-gray-100 text-gray-700',
                        prospect: 'bg-blue-100 text-blue-800',
                        perdu: 'bg-red-100 text-red-800',
                      };

                      return (
                        <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                <span className="text-orange-600 font-semibold">
                                  {client.nom.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{client.nom}</p>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {client.ville}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={clientTypeColors[client.type] ?? 'bg-gray-100 text-gray-800'}>
                              {client.type}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">
                                {formatCurrency(client.caAnnuel)}
                              </span>
                              <TrendingUp className="w-4 h-4 text-green-500" />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {client.frequenceCommande}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            {formatCurrency(client.panierMoyen)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${riskColor}`}
                                aria-label={`Risque ${riskLevel}: ${client.nom}`}
                              >
                                {client.riskScore}%
                              </span>
                              {client.riskScore >= 70 && (
                                <AlertTriangle className="w-4 h-4 text-orange-500" aria-hidden="true" />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={statusColorMap[client.status] ?? 'bg-gray-100 text-gray-700'}>
                              {client.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                            {client.depot}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                <Phone className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                <Mail className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
