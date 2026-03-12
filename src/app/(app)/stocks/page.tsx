'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Package,
  AlertTriangle,
  ShoppingCart,
  BarChart3,
  Search,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useStocks, type StockItem } from '@/hooks/useStocks';
import { useAuth } from '@/hooks/useAuth';

type UrgenceBadge = StockItem['urgence'];
type CategoryFilter = 'tous' | 'viandes' | 'pains' | 'sauces' | 'fromages' | 'legumes' | 'frites' | 'boissons';

const urgenceConfig: Record<UrgenceBadge, { label: string; color: string }> = {
  critique: { label: 'Critique', color: 'bg-red-100 text-red-800 border border-red-300' },
  faible: { label: 'Faible', color: 'bg-orange-100 text-orange-800 border border-orange-300' },
  normal: { label: 'Normal', color: 'bg-green-100 text-green-800 border border-green-300' },
  surplus: { label: 'Surplus', color: 'bg-blue-100 text-blue-800 border border-blue-300' },
};

const categoryOptions: { key: CategoryFilter; label: string }[] = [
  { key: 'tous', label: 'Toutes catégories' },
  { key: 'viandes', label: 'Viandes' },
  { key: 'pains', label: 'Pains' },
  { key: 'sauces', label: 'Sauces' },
  { key: 'fromages', label: 'Fromages' },
  { key: 'legumes', label: 'Légumes' },
  { key: 'frites', label: 'Frites' },
  { key: 'boissons', label: 'Boissons' },
];

function StockProgressBar({ actuel, minimum, nom }: { actuel: number; minimum: number; nom: string }) {
  const max = minimum * 3;
  const pct = Math.min(100, max > 0 ? Math.round((actuel / max) * 100) : 0);
  const barColor =
    actuel === 0
      ? 'bg-red-500'
      : actuel <= minimum * 0.5
      ? 'bg-red-400'
      : actuel <= minimum
      ? 'bg-orange-400'
      : 'bg-green-400';

  return (
    <div className="w-24">
      <div
        role="progressbar"
        aria-valuenow={actuel}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`Stock de ${nom}`}
        className="h-2 bg-gray-200 rounded-full overflow-hidden"
      >
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-0.5 text-center">{pct}%</p>
    </div>
  );
}

export default function StocksPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'manager';
  const depotParam = isAdmin ? undefined : (user?.depot ?? undefined);

  const { stocks, loading, getStats } = useStocks(depotParam);
  const stats = getStats();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('tous');

  const criticalItems = stocks.filter(s => s.urgence === 'critique');

  const filteredStocks = stocks.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      item.nom.toLowerCase().includes(term) ||
      (item.ref ?? '').toLowerCase().includes(term);
    const matchCategory =
      categoryFilter === 'tous' || item.categorie === categoryFilter;
    return matchSearch && matchCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Stocks" subtitle="Chargement..." />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Gestion des stocks"
        subtitle="Suivi en temps réel des niveaux de stock"
      />

      <main id="main-content" className="p-6">
        {/* Hero card */}
        <Card className="mb-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1">Gestion des stocks temps réel</h2>
                <p className="text-purple-100">
                  {stats.total} produits suivis · {stats.critiques} critique{stats.critiques !== 1 ? 's' : ''} · {stats.faibles} faible{stats.faibles !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="ml-auto hidden md:flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">{formatCurrency(stats.valeurTotale)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
              <p className="text-sm text-gray-500">Produits suivis</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.critiques}</p>
              <p className="text-sm text-gray-500">Ruptures critiques</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <ShoppingCart className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-600">{stats.aCommander}</p>
              <p className="text-sm text-gray-500">À commander</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.valeurTotale)}</p>
              <p className="text-sm text-gray-500">Valeur stock</p>
            </CardContent>
          </Card>
        </div>

        {/* Critical alerts */}
        {criticalItems.length > 0 && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-5 h-5" />
                Alertes — stocks critiques ({criticalItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criticalItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="font-bold text-red-600 text-sm">{item.stockActuel}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.nom}</p>
                        <p className="text-sm text-gray-500">
                          Réf. {item.ref} · Min. {item.stockMinimum} unités
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 gap-1">
                        <ShoppingCart className="w-4 h-4" />
                        Commander
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher un produit..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
          >
            {categoryOptions.map(opt => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Stock table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              Inventaire des stocks
            </CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {filteredStocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <Package className="w-12 h-12 mb-3 text-gray-300" />
                <p className="text-base font-medium">Aucun produit trouvé</p>
                <p className="text-sm">Modifiez vos filtres ou ajoutez des produits.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Réf.</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock actuel</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock min.</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Niveau</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Urgence</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valeur</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStocks.map((item: StockItem) => {
                      const urg = urgenceConfig[item.urgence];
                      return (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-xs font-mono text-gray-500">{item.ref}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">{item.nom}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 capitalize">{item.categorie}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {item.stockActuel} <span className="text-xs text-gray-400">{item.unite}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.stockMinimum}</td>
                          <td className="px-4 py-3">
                            <StockProgressBar actuel={item.stockActuel} minimum={item.stockMinimum} nom={item.nom} />
                          </td>
                          <td className="px-4 py-3">
                            <Badge className={urg.color}>{urg.label}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {formatCurrency(item.valeurStock)}
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
