'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  Search,
  MapPin,
  Star,
  Phone,
  Mail,
  TrendingUp,
  Sparkles,
  Loader2,
  CheckCircle,
  Send,
  Plus
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ProspectResult {
  score: number;
  scoreDetails: {
    localisation: number;
    potentielCA: number;
    concurrence: number;
    accessibilite: number;
    reputation: number;
  };
  potentielCA: number;
  recommandation: 'haute' | 'moyenne' | 'basse';
  argumentsVente: string[];
  emailPersonnalise: string;
}

export default function ProspectionPage() {
  const [prospect, setProspect] = useState({
    nom: '',
    type: 'kebab',
    adresse: '',
    telephone: '',
    avisGoogle: '',
    nombreAvis: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ProspectResult | null>(null);

  // Demo result
  const demoResult: ProspectResult = {
    score: 78,
    scoreDetails: {
      localisation: 18,
      potentielCA: 22,
      concurrence: 15,
      accessibilite: 12,
      reputation: 11,
    },
    potentielCA: 2850,
    recommandation: 'haute',
    argumentsVente: [
      'Proximité de notre dépôt Lyon (livraison rapide)',
      'Zone à forte densité de clientèle (gare Part-Dieu)',
      'Bonne réputation en ligne (4.2 étoiles)',
      'Potentiel de cross-selling sauces et boissons',
    ],
    emailPersonnalise: `Bonjour,

Je me permets de vous contacter car j'ai remarqué votre établissement et sa belle réputation (4.2★ sur Google).

DISTRAM est le grossiste n°1 en produits halal sur Lyon, et nous travaillons déjà avec plus de 150 kebabs dans la région.

Ce que nous pouvons vous apporter :
✓ Livraison gratuite dès 200€
✓ Prix imbattables sur les broches (75€/10kg)
✓ Livraison 2x/semaine avant 11h
✓ Produits 100% halal certifiés

Seriez-vous disponible cette semaine pour une présentation de 15 minutes ?

Cordialement,
L'équipe DISTRAM`,
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2500));
    setResult(demoResult);
    setIsAnalyzing(false);
  };

  const demoProspects = [
    { nom: 'Antalya Grill', type: 'kebab', ville: 'Lyon 8', score: 82, status: 'nouveau' },
    { nom: 'Tacos Factory', type: 'tacos', ville: 'Villeurbanne', score: 75, status: 'contacte' },
    { nom: 'Pizza Express', type: 'pizza', ville: 'Lyon 3', score: 68, status: 'rdv_planifie' },
    { nom: 'Burger House', type: 'burger', ville: 'Lyon 7', score: 71, status: 'nouveau' },
  ];

  return (
    <div className="min-h-screen">
      <Header
        title="IA Prospection"
        subtitle="Identifiez et qualifiez vos prospects automatiquement"
      />

      <div className="p-6">
        {/* Hero */}
        <Card className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1">Prospection intelligente</h2>
                <p className="text-blue-100">
                  Scoring automatique, emails personnalisés, arguments de vente générés par IA
                </p>
              </div>
              <div className="ml-auto hidden md:block">
                <Badge className="bg-white/20 text-white border-0">
                  +15 prospects/semaine
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Analyser un prospect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'établissement *
                  </label>
                  <Input
                    value={prospect.nom}
                    onChange={(e) => setProspect({ ...prospect, nom: e.target.value })}
                    placeholder="Kebab Istanbul"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={prospect.type}
                    onChange={(e) => setProspect({ ...prospect, type: e.target.value })}
                  >
                    <option value="kebab">Kebab</option>
                    <option value="tacos">Tacos</option>
                    <option value="pizza">Pizzeria</option>
                    <option value="burger">Burger</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse complète *
                </label>
                <Input
                  value={prospect.adresse}
                  onChange={(e) => setProspect({ ...prospect, adresse: e.target.value })}
                  placeholder="123 rue de Lyon, 69003 Lyon"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <Input
                    value={prospect.telephone}
                    onChange={(e) => setProspect({ ...prospect, telephone: e.target.value })}
                    placeholder="04 78 XX XX XX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note Google
                  </label>
                  <Input
                    value={prospect.avisGoogle}
                    onChange={(e) => setProspect({ ...prospect, avisGoogle: e.target.value })}
                    placeholder="4.2"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                  />
                </div>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !prospect.nom || !prospect.adresse}
                className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyser avec l'IA
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Résultat de l'analyse
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!result && !isAnalyzing && (
                <div className="text-center py-12 text-gray-500">
                  <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Remplissez le formulaire pour analyser un prospect</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Analyse du prospect en cours...</p>
                </div>
              )}

              {result && (
                <div className="space-y-6">
                  {/* Score */}
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl">
                    <div className="text-5xl font-bold text-blue-600 mb-2">{result.score}/100</div>
                    <Badge variant={result.recommandation === 'haute' ? 'success' : result.recommandation === 'moyenne' ? 'warning' : 'secondary'}>
                      Priorité {result.recommandation}
                    </Badge>
                  </div>

                  {/* Score details */}
                  <div className="space-y-2">
                    {Object.entries(result.scoreDetails).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 capitalize">{key.replace('CA', ' CA')}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${(value / 25) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Potential */}
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">Potentiel mensuel estimé</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(result.potentielCA)}/mois</p>
                  </div>

                  {/* Arguments */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Arguments de vente</h4>
                    <ul className="space-y-2">
                      {result.argumentsVente.map((arg, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {arg}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 gap-2">
                      <Mail className="w-4 h-4" />
                      Voir email
                    </Button>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2">
                      <Send className="w-4 h-4" />
                      Contacter
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Prospects list */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Prospects récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Établissement</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {demoProspects.map((p, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{p.nom}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 capitalize">{p.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.ville}</td>
                      <td className="px-4 py-3">
                        <Badge variant={p.score >= 75 ? 'success' : p.score >= 60 ? 'warning' : 'secondary'}>
                          {p.score}/100
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="capitalize">
                          {p.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm">Voir</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
