'use client';

import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, Clock, CheckCircle, Phone } from 'lucide-react';

const demoLivreurs = [
  { id: 1, nom: 'Ahmed B.', status: 'en_route', livraisons: 8, completees: 3, position: 'Vers Pizza Napoli' },
  { id: 2, nom: 'Karim M.', status: 'livraison', livraisons: 6, completees: 4, position: 'Chez O\'Tacos Lyon 7' },
  { id: 3, nom: 'Youssef D.', status: 'en_route', livraisons: 10, completees: 7, position: 'Vers Burger Factory' },
];

export default function TrackingPage() {
  return (
    <div className="min-h-screen">
      <Header
        title="Tracking GPS"
        subtitle="Suivi en temps réel des livraisons"
      />

      <div className="p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map placeholder */}
          <Card className="lg:col-span-2">
            <CardContent className="p-0">
              <div className="h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Carte interactive</p>
                  <p className="text-sm">Intégration Leaflet/Mapbox</p>
                  <p className="text-xs mt-2 text-gray-400">
                    Les positions des livreurs s'affichent ici en temps réel
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Livreurs list */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-orange-600" />
                Livreurs actifs ({demoLivreurs.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {demoLivreurs.map((livreur) => (
                <div key={livreur.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="font-semibold text-orange-600">
                          {livreur.nom.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{livreur.nom}</p>
                        <p className="text-xs text-gray-500">{livreur.position}</p>
                      </div>
                    </div>
                    <Badge variant={livreur.status === 'livraison' ? 'warning' : 'default'}>
                      {livreur.status === 'livraison' ? 'En livraison' : 'En route'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {livreur.completees}/{livreur.livraisons} livraisons
                    </span>
                    <div className="flex gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-orange-600">
                        <MapPin className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${(livreur.completees / livreur.livraisons) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">8</p>
              <p className="text-sm text-gray-500">En cours</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">14</p>
              <p className="text-sm text-gray-500">Livrées</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">45 min</p>
              <p className="text-sm text-gray-500">Temps moyen</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">98%</p>
              <p className="text-sm text-gray-500">À l'heure</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
