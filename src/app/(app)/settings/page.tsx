'use client';

import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { User, Building2, Bell, Shield, Palette, Database } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Header
        title="Paramètres"
        subtitle="Configurez votre compte et l'application"
      />

      <div className="p-6 max-w-4xl">
        <div className="space-y-6">
          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-orange-600" />
                Profil
              </CardTitle>
              <CardDescription>Gérez vos informations personnelles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-orange-600">
                    {user?.displayName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.displayName || 'Utilisateur'}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <Badge className="mt-1">{user?.role || 'commercial'}</Badge>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                  <Input defaultValue={user?.displayName || ''} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input defaultValue={user?.email || ''} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <Input placeholder="06 XX XX XX XX" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dépôt</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="lyon">Lyon</option>
                    <option value="montpellier">Montpellier</option>
                    <option value="bordeaux">Bordeaux</option>
                  </select>
                </div>
              </div>
              <Button className="bg-orange-600 hover:bg-orange-700">
                Enregistrer les modifications
              </Button>
            </CardContent>
          </Card>

          {/* Company */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-600" />
                Entreprise
              </CardTitle>
              <CardDescription>Informations de votre entreprise</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <Input defaultValue="DISTRAM" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SIRET</label>
                  <Input defaultValue="XXX XXX XXX XXXXX" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-600" />
                Notifications
              </CardTitle>
              <CardDescription>Gérez vos préférences de notification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Alertes churn', desc: 'Clients à risque détectés' },
                  { label: 'Nouvelles commandes', desc: 'Quand une commande est passée' },
                  { label: 'Stocks faibles', desc: 'Alertes de rupture de stock' },
                  { label: 'Livraisons', desc: 'Mises à jour des livraisons' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-600" />
                Sécurité
              </CardTitle>
              <CardDescription>Paramètres de sécurité de votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline">Changer le mot de passe</Button>
              <Button variant="outline">Activer l'authentification 2FA</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
