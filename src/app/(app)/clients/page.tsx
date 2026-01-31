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
  Filter,
  Download,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import { formatCurrency, clientTypeColors, getRiskLevel, riskLevelColors } from '@/lib/utils';
import { DEMO_CLIENTS } from '@/data/demo-clients';

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');

  const filteredClients = DEMO_CLIENTS.filter(client => {
    const matchSearch = client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       client.ville.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || client.type === filterType;
    const matchRisk = filterRisk === 'all' ||
                     (filterRisk === 'high' && client.riskScore >= 50) ||
                     (filterRisk === 'low' && client.riskScore < 50);
    return matchSearch && matchType && matchRisk;
  });

  return (
    <div className="min-h-screen">
      <Header
        title="Clients"
        subtitle={`${DEMO_CLIENTS.length} clients actifs`}
        actions={
          <Button className="bg-orange-600 hover:bg-orange-700 gap-2">
            <Plus className="w-4 h-4" />
            Nouveau client
          </Button>
        }
      />

      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher un client..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Tous les types</option>
            <option value="kebab">Kebab</option>
            <option value="tacos">Tacos</option>
            <option value="pizza">Pizzeria</option>
            <option value="burger">Burger</option>
            <option value="snack">Snack</option>
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
          >
            <option value="all">Tous les risques</option>
            <option value="high">Risque élevé</option>
            <option value="low">Risque faible</option>
          </select>

          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{DEMO_CLIENTS.length}</p>
              <p className="text-sm text-gray-500">Total clients</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {DEMO_CLIENTS.filter(c => c.status === 'actif').length}
              </p>
              <p className="text-sm text-gray-500">Actifs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">
                {DEMO_CLIENTS.filter(c => c.riskScore >= 50).length}
              </p>
              <p className="text-sm text-gray-500">À risque</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(DEMO_CLIENTS.reduce((sum, c) => sum + c.panierMoyen, 0) / DEMO_CLIENTS.length)}
              </p>
              <p className="text-sm text-gray-500">Panier moyen</p>
            </CardContent>
          </Card>
        </div>

        {/* Clients table */}
        <Card>
          <CardContent className="p-0">
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
                      Risque
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
                  {filteredClients.map((client) => {
                    const riskLevel = getRiskLevel(client.riskScore);
                    return (
                      <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                              <span className="text-orange-600 font-semibold">
                                {client.nom.charAt(0)}
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
                          <Badge className={clientTypeColors[client.type] || 'bg-gray-100 text-gray-800'}>
                            {client.type}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {formatCurrency(client.caAnnuel)}
                            </span>
                            {client.evolution >= 0 ? (
                              <TrendingUp className="w-4 h-4 text-green-500" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {client.frequenceCommande}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${riskLevelColors[riskLevel]}`}>
                              {client.riskScore}%
                            </div>
                            {client.riskScore >= 50 && (
                              <AlertTriangle className="w-4 h-4 text-orange-500" />
                            )}
                          </div>
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
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
