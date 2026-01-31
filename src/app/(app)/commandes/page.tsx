'use client';

import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Clock, CheckCircle, Truck, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatDate } from '@/lib/utils';

const demoOrders = [
  { id: 'CMD-20240130-A1B2', client: "O'Tacos Lyon 7", total: 892, status: 'en_livraison', date: new Date() },
  { id: 'CMD-20240130-C3D4', client: 'Istanbul Kebab', total: 567, status: 'validee', date: new Date() },
  { id: 'CMD-20240129-E5F6', client: 'Pizza Napoli', total: 1245, status: 'livree', date: new Date(Date.now() - 86400000) },
  { id: 'CMD-20240129-G7H8', client: 'Burger Factory', total: 734, status: 'en_preparation', date: new Date(Date.now() - 86400000) },
  { id: 'CMD-20240128-I9J0', client: 'Tacos Avenue', total: 1567, status: 'livree', date: new Date(Date.now() - 172800000) },
];

const statusConfig = {
  brouillon: { label: 'Brouillon', color: 'secondary', icon: Clock },
  validee: { label: 'Validée', color: 'info', icon: CheckCircle },
  en_preparation: { label: 'En préparation', color: 'warning', icon: Package },
  en_livraison: { label: 'En livraison', color: 'default', icon: Truck },
  livree: { label: 'Livrée', color: 'success', icon: CheckCircle },
};

export default function CommandesPage() {
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

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">28</p>
              <p className="text-sm text-gray-500">Aujourd'hui</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">8</p>
              <p className="text-sm text-gray-500">En cours</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">187</p>
              <p className="text-sm text-gray-500">Cette semaine</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(78320)}</p>
              <p className="text-sm text-gray-500">CA semaine</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Rechercher une commande..." className="pl-10" />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtres
          </Button>
        </div>

        {/* Orders list */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Commande</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {demoOrders.map((order) => {
                    const config = statusConfig[order.status as keyof typeof statusConfig];
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-sm text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{order.client}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.date)}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{formatCurrency(order.total)}</td>
                        <td className="px-6 py-4">
                          <Badge variant={config.color as any} className="gap-1">
                            <config.icon className="w-3 h-3" />
                            {config.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm">Voir</Button>
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
