'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Search,
  UserCheck,
  UserX,
  Building2,
  Clock,
} from 'lucide-react';
import { subscribeToEmployees, toggleEmployeeStatus, Employee } from '@/services/firebase/employees';
import { logActivity } from '@/services/firebase/activity-log';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';

const ROLE_CONFIG: Record<UserRole, { label: string; color: string }> = {
  admin: { label: 'Admin', color: 'bg-red-100 text-red-700 border-red-200' },
  manager: { label: 'Manager', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  commercial: { label: 'Commercial', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  livreur: { label: 'Livreur', color: 'bg-green-100 text-green-700 border-green-200' },
  client: { label: 'Client', color: 'bg-gray-100 text-gray-700 border-gray-200' },
};

const DEPOT_LABELS: Record<string, string> = {
  lyon: 'Lyon',
  montpellier: 'Montpellier',
  bordeaux: 'Bordeaux',
};

function formatLastLogin(ts: Employee['lastLogin']): string {
  if (!ts) return 'Jamais connecté';
  try {
    const date = ts.toDate();
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  } catch {
    return 'Inconnu';
  }
}

export default function EquipePage() {
  const { user, isManager } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToEmployees((data) => {
      setEmployees(data);
    });
    return () => unsubscribe();
  }, []);

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.displayName.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.role.toLowerCase().includes(q)
    );
  });

  const totalStaff = employees.length;
  const totalActive = employees.filter((e) => e.status === 'actif').length;
  const totalSuspended = employees.filter((e) => e.status === 'suspendu').length;
  const byDepot = ['lyon', 'montpellier', 'bordeaux'].map((depot) => ({
    depot,
    count: employees.filter((e) => e.depot === depot).length,
  }));

  const handleToggleStatus = async (employee: Employee) => {
    if (!isManager || !user) return;
    const newStatus = employee.status === 'actif' ? 'suspendu' : 'actif';
    setTogglingId(employee.id);
    try {
      await toggleEmployeeStatus(employee.id, newStatus);
      await logActivity(
        user.uid,
        user.email ?? '',
        user.role,
        newStatus === 'suspendu' ? 'user_suspended' : 'user_activated',
        { targetUserId: employee.id, targetEmail: employee.email, newStatus },
        'user',
        employee.id
      );
    } catch (err) {
      console.error('Failed to toggle employee status:', err);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Equipe"
        subtitle="Gestion des collaborateurs et des accès"
      />

      <div className="p-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalStaff}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{totalActive}</p>
                <p className="text-xs text-gray-500">Actifs</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <UserX className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700">{totalSuspended}</p>
                <p className="text-xs text-gray-500">Suspendus</p>
              </div>
            </CardContent>
          </Card>

          {byDepot.map(({ depot, count }) => (
            <Card key={depot}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700">{count}</p>
                  <p className="text-xs text-gray-500">{DEPOT_LABELS[depot]}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher par nom, email ou role..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Employee grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" />
              Collaborateurs ({filtered.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">
                {search ? 'Aucun résultat pour cette recherche' : 'Aucun collaborateur trouvé'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3 pr-4">
                        Collaborateur
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3 pr-4">
                        Role
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3 pr-4">
                        Depot
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3 pr-4">
                        Derniere connexion
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3 pr-4">
                        Statut
                      </th>
                      {isManager && (
                        <th className="text-right text-xs font-medium text-gray-500 uppercase pb-3">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((employee) => {
                      const roleConfig = ROLE_CONFIG[employee.role] ?? ROLE_CONFIG.commercial;
                      const isActive = employee.status === 'actif';
                      const isToggling = togglingId === employee.id;
                      const isSelf = user?.uid === employee.id;

                      return (
                        <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                {employee.displayName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">
                                  {employee.displayName}
                                  {isSelf && (
                                    <span className="ml-2 text-xs text-gray-400">(vous)</span>
                                  )}
                                </p>
                                <p className="text-xs text-gray-500">{employee.email}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 pr-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleConfig.color}`}
                            >
                              {roleConfig.label}
                            </span>
                          </td>

                          <td className="py-4 pr-4">
                            <span className="text-sm text-gray-600">
                              {DEPOT_LABELS[employee.depot] ?? employee.depot}
                            </span>
                          </td>

                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Clock className="w-3.5 h-3.5" />
                              {formatLastLogin(employee.lastLogin)}
                            </div>
                          </td>

                          <td className="py-4 pr-4">
                            <Badge
                              variant={isActive ? 'success' : 'destructive'}
                              className="text-xs"
                            >
                              {isActive ? 'Actif' : 'Suspendu'}
                            </Badge>
                          </td>

                          {isManager && (
                            <td className="py-4 text-right">
                              <Button
                                size="sm"
                                variant={isActive ? 'outline' : 'default'}
                                disabled={isToggling || isSelf}
                                onClick={() => handleToggleStatus(employee)}
                                className={
                                  isActive
                                    ? 'border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs'
                                    : 'bg-green-600 hover:bg-green-700 text-white text-xs'
                                }
                              >
                                {isToggling
                                  ? '...'
                                  : isActive
                                  ? 'Suspendre'
                                  : 'Activer'}
                              </Button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
