'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Truck,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Navigation,
  Package,
  User,
  ChevronRight,
  AlertCircle,
  Home,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Livraison {
  id: string;
  client: string;
  adresse: string;
  telephone: string;
  heurePrevu: string;
  status: 'a_faire' | 'en_cours' | 'termine';
  produits: { nom: string; quantite: number }[];
  notes?: string;
  position: number;
}

export default function LivraisonsPage() {
  const { user, signOut } = useAuth();
  const [livraisons, setLivraisons] = useState<Livraison[]>([
    {
      id: '1',
      client: "O'Tacos Lyon 7",
      adresse: '128 Avenue Jean Jaurès, 69007 Lyon',
      telephone: '04 78 12 34 56',
      heurePrevu: '09:15',
      status: 'termine',
      produits: [
        { nom: 'Broche kebab 10kg', quantite: 3 },
        { nom: 'Pain pita (lot 100)', quantite: 2 }
      ],
      position: 1
    },
    {
      id: '2',
      client: 'Istanbul Kebab',
      adresse: '45 Rue de la République, 69002 Lyon',
      telephone: '04 78 23 45 67',
      heurePrevu: '09:45',
      status: 'termine',
      produits: [
        { nom: 'Broche kebab 10kg', quantite: 4 },
        { nom: 'Sauce blanche 5L', quantite: 3 }
      ],
      position: 2
    },
    {
      id: '3',
      client: 'Pizza Napoli',
      adresse: '67 Cours Gambetta, 69003 Lyon',
      telephone: '04 78 34 56 78',
      heurePrevu: '10:20',
      status: 'en_cours',
      produits: [
        { nom: 'Fromage mozzarella 2kg', quantite: 5 },
        { nom: 'Sauce tomate 5L', quantite: 4 }
      ],
      notes: 'Accès par la cour arrière',
      position: 3
    },
    {
      id: '4',
      client: 'Burger Factory',
      adresse: '23 Rue Mercière, 69002 Lyon',
      telephone: '04 78 45 67 89',
      heurePrevu: '10:50',
      status: 'a_faire',
      produits: [
        { nom: 'Steaks hachés (carton 50)', quantite: 2 },
        { nom: 'Fromage cheddar 1kg', quantite: 4 }
      ],
      position: 4
    },
    {
      id: '5',
      client: 'Tacos Avenue',
      adresse: 'Centre Commercial Part-Dieu, 69003 Lyon',
      telephone: '04 78 56 78 90',
      heurePrevu: '11:25',
      status: 'a_faire',
      produits: [
        { nom: 'Galettes tortilla (pack 100)', quantite: 3 },
        { nom: 'Sauce fromagère 5L', quantite: 5 }
      ],
      notes: 'Livraison zone de déchargement B2',
      position: 5
    },
  ]);

  const [selectedLivraison, setSelectedLivraison] = useState<Livraison | null>(null);

  const stats = {
    total: livraisons.length,
    terminees: livraisons.filter(l => l.status === 'termine').length,
    enCours: livraisons.filter(l => l.status === 'en_cours').length,
    aFaire: livraisons.filter(l => l.status === 'a_faire').length,
  };

  const handleStatusChange = (id: string, newStatus: Livraison['status']) => {
    setLivraisons(livraisons.map(l =>
      l.id === id ? { ...l, status: newStatus } : l
    ));
    setSelectedLivraison(null);
  };

  const getStatusColor = (status: Livraison['status']) => {
    switch (status) {
      case 'termine': return 'bg-green-100 text-green-800';
      case 'en_cours': return 'bg-blue-100 text-blue-800';
      case 'a_faire': return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Livraison['status']) => {
    switch (status) {
      case 'termine': return 'Terminée';
      case 'en_cours': return 'En cours';
      case 'a_faire': return 'À faire';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold">Mes livraisons</h1>
              <p className="text-sm text-green-100">{user?.displayName || 'Livreur'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Home className="w-5 h-5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => signOut()}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="p-4">
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-600">{stats.terminees}</p>
            <p className="text-xs text-gray-500">Faites</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-blue-600">{stats.enCours}</p>
            <p className="text-xs text-gray-500">En cours</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-600">{stats.aFaire}</p>
            <p className="text-xs text-gray-500">Restantes</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progression</span>
            <span className="text-sm font-bold text-green-600">
              {Math.round((stats.terminees / stats.total) * 100)}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${(stats.terminees / stats.total) * 100}%` }}
            />
          </div>
        </div>

        {/* Livraisons list */}
        <div className="space-y-3">
          {livraisons.map((livraison) => (
            <Card
              key={livraison.id}
              className={`cursor-pointer transition-all ${
                livraison.status === 'en_cours' ? 'border-blue-500 border-2' : ''
              }`}
              onClick={() => setSelectedLivraison(livraison)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    livraison.status === 'termine' ? 'bg-green-500 text-white' :
                    livraison.status === 'en_cours' ? 'bg-blue-500 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {livraison.status === 'termine' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="font-bold">{livraison.position}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900">{livraison.client}</p>
                      <Badge className={getStatusColor(livraison.status)}>
                        {getStatusLabel(livraison.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{livraison.adresse}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {livraison.heurePrevu}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {livraison.produits.reduce((sum, p) => sum + p.quantite, 0)} articles
                      </span>
                    </div>
                    {livraison.notes && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-orange-600">
                        <AlertCircle className="w-3 h-3" />
                        {livraison.notes}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Detail modal */}
      {selectedLivraison && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between">
              <h2 className="font-bold text-lg">{selectedLivraison.client}</h2>
              <button
                onClick={() => setSelectedLivraison(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Status */}
              <div className="flex justify-center">
                <Badge className={`text-base px-4 py-1 ${getStatusColor(selectedLivraison.status)}`}>
                  {getStatusLabel(selectedLivraison.status)}
                </Badge>
              </div>

              {/* Address */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{selectedLivraison.adresse}</p>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(selectedLivraison.adresse)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 flex items-center gap-1 mt-1"
                      >
                        <Navigation className="w-4 h-4" />
                        Ouvrir dans Maps
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{selectedLivraison.telephone}</span>
                    </div>
                    <a
                      href={`tel:${selectedLivraison.telephone}`}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Appeler
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Produits */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-400" />
                    Produits à livrer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedLivraison.produits.map((produit, index) => (
                      <li key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                        <span className="text-gray-700">{produit.nom}</span>
                        <span className="font-bold text-gray-900">x{produit.quantite}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Notes */}
              {selectedLivraison.notes && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      <p className="text-sm text-orange-800">{selectedLivraison.notes}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="space-y-2 pt-4">
                {selectedLivraison.status === 'a_faire' && (
                  <Button
                    onClick={() => handleStatusChange(selectedLivraison.id, 'en_cours')}
                    className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
                    size="lg"
                  >
                    <Navigation className="w-5 h-5" />
                    Démarrer la livraison
                  </Button>
                )}
                {selectedLivraison.status === 'en_cours' && (
                  <Button
                    onClick={() => handleStatusChange(selectedLivraison.id, 'termine')}
                    className="w-full bg-green-600 hover:bg-green-700 gap-2"
                    size="lg"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Marquer comme livrée
                  </Button>
                )}
                {selectedLivraison.status === 'termine' && (
                  <div className="text-center py-4">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-green-600 font-medium">Livraison terminée</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
