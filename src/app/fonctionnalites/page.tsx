'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Camera,
  Target,
  Shield,
  Route,
  Package,
  MessageCircle,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Zap,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function FonctionnalitesPage() {
  const features = [
    {
      icon: Camera,
      title: 'Scan Menu IA',
      description: 'Photographiez le menu d\'un client et obtenez instantanément une proposition commerciale personnalisée.',
      benefits: [
        'Analyse visuelle du menu en 3 secondes',
        'Suggestions de produits adaptées',
        'Estimation du potentiel CA',
        'Génération automatique de devis'
      ],
      color: 'orange'
    },
    {
      icon: Target,
      title: 'Prospection IA',
      description: 'Identifiez et qualifiez automatiquement vos meilleurs prospects avec un scoring intelligent.',
      benefits: [
        'Scoring 0-100 de chaque prospect',
        'Arguments de vente personnalisés',
        'Emails de prospection générés',
        'Priorisation automatique'
      ],
      color: 'blue'
    },
    {
      icon: Shield,
      title: 'Anti-Churn IA',
      description: 'Détectez les clients à risque 30 jours avant leur départ et activez des plans de rétention.',
      benefits: [
        'Détection précoce des signaux',
        'Score de risque en temps réel',
        'Plans de rétention suggérés',
        '-40% de churn garanti'
      ],
      color: 'red'
    },
    {
      icon: Route,
      title: 'Tournées IA',
      description: 'Optimisez vos routes de livraison en respectant créneaux, capacités et priorités.',
      benefits: [
        'Optimisation multi-contraintes',
        'Respect des créneaux préférentiels',
        'Économie de 30% sur les km',
        'Intégration trafic temps réel'
      ],
      color: 'green'
    },
    {
      icon: Package,
      title: 'Stocks IA',
      description: 'Anticipez les ruptures et optimisez vos approvisionnements grâce à la prédiction.',
      benefits: [
        'Prédiction des besoins à 14 jours',
        'Alertes de rupture automatiques',
        'Suggestions de commandes',
        '-25% de ruptures de stock'
      ],
      color: 'purple'
    },
    {
      icon: MessageCircle,
      title: 'Assistant Commercial IA',
      description: 'Votre coach de vente personnel disponible 24/7 pour conseils et argumentaires.',
      benefits: [
        'Réponses aux objections',
        'Argumentaires personnalisés',
        'Analyse de portefeuille',
        'Tips de négociation'
      ],
      color: 'indigo'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; light: string }> = {
      orange: { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-100' },
      blue: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-100' },
      red: { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-100' },
      green: { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-100' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-100' },
      indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', light: 'bg-indigo-100' },
    };
    return colors[color] || colors.orange;
  };

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
            <Link href="/fonctionnalites" className="text-orange-600 font-medium">Fonctionnalités</Link>
            <Link href="/tarifs" className="text-gray-600 hover:text-gray-900">Tarifs</Link>
            <Link href="/demo" className="text-gray-600 hover:text-gray-900">Démo</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline">Connexion</Button>
            </Link>
            <Link href="/demo">
              <Button className="bg-orange-600 hover:bg-orange-700">Essai gratuit</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">6 modules IA intégrés</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            L'IA au service de votre<br />
            <span className="text-orange-600">croissance commerciale</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Chaque module IA a été conçu pour automatiser et optimiser un aspect clé de votre activité de grossiste alimentaire.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/demo">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 gap-2">
                Demander une démo
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-24">
            {features.map((feature, index) => {
              const colors = getColorClasses(feature.color);
              const isReversed = index % 2 === 1;

              return (
                <div
                  key={index}
                  className={`flex flex-col lg:flex-row items-center gap-12 ${isReversed ? 'lg:flex-row-reverse' : ''}`}
                >
                  {/* Content */}
                  <div className="flex-1 space-y-6">
                    <div className={`w-16 h-16 ${colors.light} rounded-2xl flex items-center justify-center`}>
                      <feature.icon className={`w-8 h-8 ${colors.text}`} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{feature.title}</h2>
                    <p className="text-lg text-gray-600">{feature.description}</p>
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle className={`w-5 h-5 ${colors.text}`} />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/demo">
                      <Button className={`${colors.bg} hover:opacity-90 gap-2`}>
                        Voir en action
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>

                  {/* Visual */}
                  <div className="flex-1">
                    <Card className={`${colors.light} border-0`}>
                      <CardContent className="p-8">
                        <div className="aspect-video bg-white rounded-xl shadow-lg flex items-center justify-center">
                          <div className="text-center">
                            <feature.icon className={`w-20 h-20 ${colors.text} mx-auto mb-4 opacity-50`} />
                            <p className="text-gray-500">Aperçu {feature.title}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Des résultats concrets pour nos clients
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: TrendingUp, value: '+35%', label: 'de CA moyen' },
              { icon: Clock, value: '2h', label: 'gagnées / jour' },
              { icon: Shield, value: '-40%', label: 'de churn' },
              { icon: Zap, value: '3 sec', label: 'analyse menu' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <p className="text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à transformer votre activité ?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Rejoignez les grossistes qui ont déjà adopté l'IA pour booster leurs performances.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/demo">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 gap-2">
                Demander une démo gratuite
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/tarifs">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Voir les tarifs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>&copy; 2026 Face Media Grossiste. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
