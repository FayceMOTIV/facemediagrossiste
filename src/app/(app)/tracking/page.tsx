'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, Clock, CheckCircle, Radio } from 'lucide-react';
import { useAllLivreurs } from '@/hooks/useTracking';
import type { LivreurPosition } from '@/services/firebase/realtime';

const LiveMap = dynamic(() => import('@/components/map/LiveMap'), { ssr: false });

// Status colors
const STATUS_COLORS: Record<LivreurPosition['status'], string> = {
  en_route: '#3b82f6',
  livraison: '#f97316',
  pause: '#6b7280',
  termine: '#22c55e',
};

const STATUS_LABELS: Record<LivreurPosition['status'], string> = {
  en_route: 'En route',
  livraison: 'En livraison',
  pause: 'En pause',
  termine: 'Terminé',
};

function StatusBadge({ status }: { status: LivreurPosition['status'] }) {
  const colorMap: Record<LivreurPosition['status'], string> = {
    en_route: 'bg-blue-100 text-blue-800',
    livraison: 'bg-orange-100 text-orange-800',
    pause: 'bg-gray-100 text-gray-800',
    termine: 'bg-green-100 text-green-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export default function TrackingPage() {
  const { livreursActifs, loading, count } = useAllLivreurs();
  const [selectedLivreurId, setSelectedLivreurId] = useState<string | undefined>(undefined);

  // Compute stats
  const enRoute = livreursActifs.filter(p => p.status === 'en_route').length;
  const enLivraison = livreursActifs.filter(p => p.status === 'livraison').length;
  const enPause = livreursActifs.filter(p => p.status === 'pause').length;
  const termines = livreursActifs.filter(p => p.status === 'termine').length;

  return (
    <div className="min-h-screen">
      <Header
        title="Tracking GPS"
        subtitle="Suivi en temps réel des livraisons"
      />

      <div className="p-6">
        {/* Auto-refresh indicator */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
          <Radio className="w-4 h-4 text-green-500 animate-pulse" />
          <span>Mise à jour en temps réel via Firebase Realtime DB</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{enRoute}</p>
              <p className="text-sm text-gray-500">En route</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">{enLivraison}</p>
              <p className="text-sm text-gray-500">En livraison</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{termines}</p>
              <p className="text-sm text-gray-500">Livrés aujourd&apos;hui</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-600">{enPause}</p>
              <p className="text-sm text-gray-500">En pause</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left panel: livreurs list */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-orange-600" />
                Livreurs actifs ({count})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
              {loading && (
                <div className="flex items-center justify-center py-8 text-gray-400">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
                  Chargement...
                </div>
              )}

              {!loading && livreursActifs.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm font-medium">Aucun livreur actif</p>
                  <p className="text-xs mt-1">Les livreurs apparaissent ici quand ils activent le tracking GPS</p>
                </div>
              )}

              {livreursActifs.map((pos) => (
                <div
                  key={pos.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${
                    selectedLivreurId === pos.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-transparent bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedLivreurId(
                    selectedLivreurId === pos.id ? undefined : pos.id
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {/* Avatar with status color */}
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ backgroundColor: STATUS_COLORS[pos.status] }}
                      >
                        {pos.nom?.charAt(0)?.toUpperCase() ?? '?'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{pos.nom}</p>
                        {pos.currentDelivery && (
                          <p className="text-xs text-gray-500 truncate max-w-[120px]">
                            {pos.currentDelivery}
                          </p>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={pos.status} />
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(pos.timestamp), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </span>
                    {pos.speed !== undefined && pos.speed !== null && (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {Math.round(pos.speed * 3.6)} km/h
                      </span>
                    )}
                  </div>

                  {/* Coordinates */}
                  {pos.lat && pos.lng && (
                    <p className="text-xs text-gray-400 mt-1">
                      {pos.lat.toFixed(4)}, {pos.lng.toFixed(4)}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Right: LiveMap */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <LiveMap
                  positions={livreursActifs}
                  centerLat={45.75}
                  centerLng={4.85}
                  zoom={12}
                  height="500px"
                  selectedLivreurId={selectedLivreurId}
                  onLivreurClick={(id) => setSelectedLivreurId(
                    selectedLivreurId === id ? undefined : id
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
