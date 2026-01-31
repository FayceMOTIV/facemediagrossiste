'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  ArrowRight,
  Sparkles,
  CheckCircle,
  Calendar,
  Users,
  Building2,
  Phone,
  Mail,
  MapPin,
  Loader2
} from 'lucide-react';

export default function DemoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    entreprise: '',
    ville: '',
    nombreClients: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <Card className="max-w-lg mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Demande envoyée !
            </h1>
            <p className="text-gray-600 mb-6">
              Merci pour votre intérêt. Un conseiller vous contactera dans les 24h pour planifier votre démo personnalisée.
            </p>
            <div className="space-y-3">
              <Link href="/">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Retour à l'accueil
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Accéder à mon compte
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">FM</span>
            </div>
            <span className="font-bold text-xl">Face Media Grossiste</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/fonctionnalites" className="text-gray-600 hover:text-gray-900">Fonctionnalités</Link>
            <Link href="/tarifs" className="text-gray-600 hover:text-gray-900">Tarifs</Link>
            <Link href="/demo" className="text-orange-600 font-medium">Démo</Link>
          </nav>
          <Link href="/login">
            <Button variant="outline">Connexion</Button>
          </Link>
        </div>
      </header>

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left - Info */}
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Démo personnalisée gratuite</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Découvrez Face Media<br />
                <span className="text-orange-600">en 30 minutes</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Un expert vous présentera la plateforme en direct et répondra à toutes vos questions. Aucun engagement, aucune carte bancaire requise.
              </p>

              {/* Benefits */}
              <div className="space-y-4 mb-12">
                {[
                  { icon: Calendar, text: 'Démo personnalisée selon votre activité' },
                  { icon: Users, text: 'Présentation des 6 modules IA en action' },
                  { icon: Building2, text: 'Conseils adaptés à votre taille d\'entreprise' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <Card className="bg-gray-50 border-0">
                <CardContent className="p-6">
                  <p className="text-gray-700 italic mb-4">
                    "Grâce à Face Media, nous avons augmenté notre CA de 40% en 6 mois. L'IA nous fait gagner 2h par jour sur la prospection."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                      <span className="font-bold text-orange-600">MK</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Mohamed K.</p>
                      <p className="text-sm text-gray-500">Directeur Commercial, DISTRAM Lyon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right - Form */}
            <Card className="shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Demander une démo
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom *
                      </label>
                      <Input
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        placeholder="Mohamed"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom *
                      </label>
                      <Input
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        placeholder="Kabbaj"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email professionnel *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="mohamed@distram.fr"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        name="telephone"
                        type="tel"
                        value={formData.telephone}
                        onChange={handleChange}
                        placeholder="06 XX XX XX XX"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de l'entreprise *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        name="entreprise"
                        value={formData.entreprise}
                        onChange={handleChange}
                        placeholder="DISTRAM"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ville
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          name="ville"
                          value={formData.ville}
                          onChange={handleChange}
                          placeholder="Lyon"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de clients
                      </label>
                      <select
                        name="nombreClients"
                        value={formData.nombreClients}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Sélectionner</option>
                        <option value="1-50">1-50</option>
                        <option value="51-150">51-150</option>
                        <option value="151-500">151-500</option>
                        <option value="500+">500+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message (optionnel)
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
                      placeholder="Précisez vos besoins ou vos questions..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-600 hover:bg-orange-700 gap-2"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        Demander ma démo gratuite
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    En soumettant ce formulaire, vous acceptez d'être contacté par notre équipe commerciale.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>&copy; 2026 Face Media Grossiste. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
