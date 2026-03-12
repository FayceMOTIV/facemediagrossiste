'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  Clock,
  CheckCircle,
  Truck,
  Package,
  ShoppingBag,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import type { Order } from '@/types';
import { Timestamp } from 'firebase/firestore';

type StatusFilter = 'tous' | Order['status'];

interface StatusConfig {
  label: string;
  color: string;
  icon: React.ElementType;
}

const statusConfig: Record<Order['status'], StatusConfig> = {
  brouillon: { label: 'Brouillon', color: 'bg-gray-100 text-gray-700', icon: Clock },
  validee: { label: 'Validée', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  en_preparation: { label: 'En préparation', color: 'bg-yellow-100 text-yellow-800', icon: Package },
  en_livraison: { label: 'En livraison', color: 'bg-purple-100 text-purple-800', icon: Truck },
  livree: { label: 'Livrée', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  annulee: { label: 'Annulée', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
};

const workflowNext: Partial<Record<Order['status'], Order['status']>> = {
  brouillon: 'validee',
  validee: 'en_preparation',
  en_preparation: 'en_livraison',
  en_livraison: 'livree',
};

const statusFilterButtons: { key: StatusFilter; label: string }[] = [
  { key: 'tous', label: 'Tous' },
  { key: 'brouillon', label: 'En attente' },
  { key: 'en_preparation', label: 'En préparation' },
  { key: 'en_livraison', label: 'En livraison' },
  { key: 'livree', label: 'Livrées' },
];

function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (value && typeof value === 'object' && 'toDate' in value) {
    return (value as Timestamp).toDate();
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return new Date(value);
  }
  return new Date();
}

export default function CommandesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'manager';
  const depotFilter = isAdmin ? undefined : (user?.depot ?? undefined);

  const { orders, loading, updateStatus, getStats } = useOrders(
    depotFilter ? { depot: depotFilter } : undefined
  );
  const stats = getStats();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('tous');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      order.numero.toLowerCase().includes(term) ||
      order.clientNom.toLowerCase().includes(term);

    const matchStatus =
      statusFilter === 'tous' || order.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const handleAdvanceStatus = async (order: Order) => {
    const next = workflowNext[order.status];
    if (!next) return;
    const config = statusConfig[next];
    if (!window.confirm(`Passer la commande ${order.numero} en "${config.label}" ?`)) return;
    setUpdatingId(order.id);
    try {
      await updateStatus(order.id, next);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Commandes" subtitle="Chargement..." />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Commandes"
        subtitle="Gérez vos commandes et suivez les livraisons"
        actions={
          <Button className="bg-orange-600 hover:bg-orange-700 gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle commande
          </Button>
        }
      />

      <main id="main-content" className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.aujourd_hui}</p>
              <p className="text-sm text-gray-500">Aujourd'hui</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.en_cours}</p>
              <p className="text-sm text-gray-500">En cours</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.cette_semaine}</p>
              <p className="text-sm text-gray-500">Cette semaine</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.ca_semaine)}</p>
              <p className="text-sm text-gray-500">CA semaine</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher une commande ou un client..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-1 flex-wrap">
            {statusFilterButtons.map((btn) => (
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
        </div>

        {/* Orders table */}
        <Card>
          <CardContent className="p-0">
            {filteredOrders.length === 0 ? (

              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <ShoppingBag className="w-12 h-12 mb-3 text-gray-300" />
                <p className="text-base font-medium">Aucune commande trouvée</p>
                <p className="text-sm">Modifiez vos filtres ou créez une nouvelle commande.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table role="table" aria-label="Liste des commandes" className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        N° Commande
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Montant TTC
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOrders.map((order: Order) => {
                      const cfg = statusConfig[order.status];
                      const IconComponent = cfg.icon;
                      const nextStatus = workflowNext[order.status];
                      const isUpdating = updatingId === order.id;
                      const orderDate = toDate(order.createdAt);

                      return (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-mono text-sm text-gray-900">
                            {order.numero}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {order.clientNom}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {formatDate(orderDate)}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {formatCurrency(order.totalTTC)}
                          </td>
                          <td className="px-6 py-4">
                            <Badge aria-label={`Statut: ${cfg.label}`} className={`gap-1 ${cfg.color}`}>
                              <IconComponent className="w-3 h-3" aria-hidden="true" />
                              {cfg.label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {nextStatus && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAdvanceStatus(order)}
                                  disabled={isUpdating}
                                  className="text-xs"
                                  aria-label={`Passer la commande ${order.numero} en ${statusConfig[nextStatus].label}`}
                                >
                                  {isUpdating ? (
                                    <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
                                  ) : (
                                    `→ ${statusConfig[nextStatus].label}`
                                  )}
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" aria-label={`Voir la commande ${order.numero}`}>
                                Voir
                              </Button>
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
