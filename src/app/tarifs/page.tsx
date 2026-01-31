'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  X,
  ArrowRight,
  Sparkles,
  Users,
  Building2,
  Rocket,
  HelpCircle
} from 'lucide-react';

export default function TarifsPage() {
  const plans = [
    {
      name: 'Starter',
      description: 'Pour démarrer avec l\'IA',
      price: 99,
      period: '/mois',
      icon: Users,
      popular: false,
      features: [
        { name: '1 utilisateur', included: true },
        { name: 'Scan Menu IA', included: true },
        { name: 'Assistant Commercial IA', included: true },
        { name: '50 analyses/mois', included: true },
        { name: 'Prospection IA', included: false },
        { name: 'Anti-Churn IA', included: false },
        { name: 'Tournées IA', included: false },
        { name: 'Stocks IA', included: false },
        { name: 'Support prioritaire', included: false },
      ],
      cta: 'Commencer',
      ctaVariant: 'outline' as const
    },
    {
      name: 'Pro',
      description: 'Le plus populaire',
      price: 299,
      period: '/mois',
      icon: Rocket,
      popular: true,
      features: [
        { name: '5 utilisateurs', included: true },
        { name: 'Scan Menu IA', included: true },
        { name: 'Assistant Commercial IA', included: true },
        { name: 'Analyses illimitées', included: true },
        { name: 'Prospection IA', included: true },
        { name: 'Anti-Churn IA', included: true },
        { name: 'Tournées IA', included: true },
        { name: 'Stocks IA', included: false },
        { name: 'Support prioritaire', included: true },
      ],
      cta: 'Essai gratuit 14 jours',
      ctaVariant: 'default' as const
    },
    {
      name: 'Enterprise',
      description: 'Pour les grandes équipes',
      price: 599,
      period: '/mois',
      icon: Building2,
      popular: false,
      features: [
        { name: 'Utilisateurs illimités', included: true },
        { name: 'Scan Menu IA', included: true },
        { name: 'Assistant Commercial IA', included: true },
        { name: 'Analyses illimitées', included: true },
        { name: 'Prospection IA', included: true },
        { name: 'Anti-Churn IA', included: true },
        { name: 'Tournées IA', included: true },
        { name: 'Stocks IA', included: true },
        { name: 'Support prioritaire 24/7', included: true },
      ],
      cta: 'Contacter les ventes',
      ctaVariant: 'outline' as const
    }
  ];

  const faqs = [
    {
      question: 'Puis-je changer de forfait à tout moment ?',
      answer: 'Oui, vous pouvez upgrader ou downgrader votre forfait à tout moment. Les changements prennent effet immédiatement et la facturation est ajustée au prorata.'
    },
    {
      question: 'Y a-t-il un engagement ?',
      answer: 'Non, tous nos forfaits sont sans engagement. Vous pouvez annuler à tout moment depuis votre espace client.'
    },
    {
      question: 'Qu\'est-ce qui est inclus dans le support prioritaire ?',
      answer: 'Le support prioritaire inclut une réponse garantie en moins de 2h, un accès à un conseiller dédié, et des sessions de formation personnalisées.'
    },
    {
      question: 'Comment fonctionne l\'essai gratuit ?',
      answer: 'L\'essai gratuit de 14 jours vous donne accès à toutes les fonctionnalités du forfait Pro sans engagement. Aucune carte bancaire n\'est requise pour commencer.'
    },
    {
      question: 'Proposez-vous des remises pour les paiements annuels ?',
      answer: 'Oui, nous offrons 2 mois gratuits (soit -17%) sur tous les forfaits payés annuellement.'
    }
  ];

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
            <Link href="/tarifs" className="text-orange-600 font-medium">Tarifs</Link>
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
            <span className="text-sm font-medium">14 jours d'essai gratuit</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Des tarifs simples et<br />
            <span className="text-orange-600">transparents</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choisissez le forfait adapté à la taille de votre équipe. Sans engagement, évolutif à tout moment.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.popular ? 'border-orange-500 border-2 shadow-xl' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-orange-600 text-white px-4 py-1">
                      Le plus populaire
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="w-8 h-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <p className="text-gray-500">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}€</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                        )}
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/demo">
                    <Button
                      className={`w-full gap-2 ${
                        plan.popular ? 'bg-orange-600 hover:bg-orange-700' : ''
                      }`}
                      variant={plan.ctaVariant}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comparaison détaillée
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-500">Fonctionnalité</th>
                  <th className="p-4 text-center font-medium text-gray-900">Starter</th>
                  <th className="p-4 text-center font-medium text-orange-600 bg-orange-50">Pro</th>
                  <th className="p-4 text-center font-medium text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { feature: 'Utilisateurs', starter: '1', pro: '5', enterprise: 'Illimité' },
                  { feature: 'Scan Menu IA', starter: true, pro: true, enterprise: true },
                  { feature: 'Assistant Commercial', starter: true, pro: true, enterprise: true },
                  { feature: 'Prospection IA', starter: false, pro: true, enterprise: true },
                  { feature: 'Anti-Churn IA', starter: false, pro: true, enterprise: true },
                  { feature: 'Tournées IA', starter: false, pro: true, enterprise: true },
                  { feature: 'Stocks IA', starter: false, pro: false, enterprise: true },
                  { feature: 'Analyses', starter: '50/mois', pro: 'Illimité', enterprise: 'Illimité' },
                  { feature: 'Support', starter: 'Email', pro: 'Prioritaire', enterprise: '24/7 dédié' },
                  { feature: 'Formation', starter: 'Docs', pro: 'Webinaires', enterprise: 'Sur-mesure' },
                  { feature: 'API', starter: false, pro: true, enterprise: true },
                  { feature: 'SSO', starter: false, pro: false, enterprise: true },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="p-4 font-medium text-gray-900">{row.feature}</td>
                    {['starter', 'pro', 'enterprise'].map((plan) => {
                      const value = row[plan as keyof typeof row];
                      return (
                        <td key={plan} className={`p-4 text-center ${plan === 'pro' ? 'bg-orange-50' : ''}`}>
                          {typeof value === 'boolean' ? (
                            value ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 mx-auto" />
                            )
                          ) : (
                            <span className="text-gray-700">{value}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <HelpCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">Questions fréquentes</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à booster votre activité ?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Commencez votre essai gratuit de 14 jours. Sans carte bancaire, sans engagement.
          </p>
          <Link href="/demo">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 gap-2">
              Démarrer l'essai gratuit
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
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
