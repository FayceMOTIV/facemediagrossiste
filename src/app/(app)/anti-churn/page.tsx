'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  AlertTriangle,
  TrendingDown,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  Users,
  ArrowRight,
  Sparkles,
  Loader2,
  X,
  Brain,
} from 'lucide-react';
import { formatCurrency, formatRelativeDate } from '@/lib/utils';
import { DEMO_CLIENTS } from '@/data/demo-clients';
import type { ChurnAnalysis } from '@/app/api/ai/churn/route';

interface ChurnAnalysisResult extends ChurnAnalysis {
  clientId: string;
}

export default function AntiChurnPage() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<
    Record<string, ChurnAnalysisResult>
  >({});
  const [modalClientId, setModalClientId] = useState<string | null>(null);

  // Clients à risque (score > 50)
  const clientsAtRisk = DEMO_CLIENTS.filter(
    (c) => c.riskScore >= 50
  ).sort((a, b) => b.riskScore - a.riskScore);

  const criticalClients = clientsAtRisk.filter((c) => c.riskScore >= 70);
  const highRiskClients = clientsAtRisk.filter(
    (c) => c.riskScore >= 50 && c.riskScore < 70
  );

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'bg-red-100 text-red-800 border-red-300';
    if (score >= 50) return 'bg-orange-100 text-orange-800 border-orange-300';
    if (score >= 30) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'Critique';
    if (score >= 50) return 'Élevé';
    if (score >= 30) return 'Modéré';
    return 'Faible';
  };

  const getNiveauColor = (niveau: ChurnAnalysis['niveau']) => {
    switch (niveau) {
      case 'critique':
        return 'bg-red-100 text-red-800';
      case 'eleve':
        return 'bg-orange-100 text-orange-800';
      case 'modere':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const handleAnalyzeChurn = async (clientId: string) => {
    const client = DEMO_CLIENTS.find((c) => c.id === clientId);
    if (!client) return;

    setLoadingAnalysis(clientId);
    try {
      const clientData = {
        nom: client.nom,
        type: client.type,
        lastOrderDate: new Date(
          Date.now() - (client.riskScore > 60 ? 25 : 10) * 24 * 60 * 60 * 1000
        ).toISOString(),
        recentAvgOrder: client.panierMoyen * (1 - Math.abs(client.evolution) / 200),
        historicAvgOrder: client.panierMoyen,
        frequenceCommande: client.frequenceCommande,
        unansweredQuotes: client.riskScore > 70 ? 2 : 0,
        recentCommercialChange: client.riskScore > 65,
        notes: client.riskScore > 70 ? 'Baisse activité significative' : '',
      };

      const response = await fetch('/api/ai/churn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          clientData,
        }),
      });

      if (!response.ok) throw new Error('Erreur analyse');
      const result: ChurnAnalysisResult = await response.json();
      setAnalyses((prev) => ({ ...prev, [clientId]: result }));
      setModalClientId(clientId);
    } catch (err) {
      console.error('Churn analysis error:', err);
    } finally {
      setLoadingAnalysis(null);
    }
  };

  const modalAnalysis = modalClientId ? analyses[modalClientId] : null;
  const modalClient = modalClientId
    ? DEMO_CLIENTS.find((c) => c.id === modalClientId)
    : null;

  return (
    <div className="min-h-screen">
      <Header
        title="IA Anti-Churn"
        subtitle="Détectez et retenez vos clients à risque"
      />

      <div className="p-6">
        {/* Hero */}
        <Card className="mb-6 bg-gradient-to-r from-red-500 to-orange-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1">
                  Protection anti-churn activée
                </h2>
                <p className="text-red-100">
                  L&apos;IA analyse vos clients en continu et détecte les
                  signaux de départ 30 jours avant
                </p>
              </div>
              <div className="ml-auto hidden md:flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <TrendingDown className="w-5 h-5" />
                <span className="font-medium">-40% de churn</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">
                {criticalClients.length}
              </p>
              <p className="text-sm text-gray-500">Critiques</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-600">
                {highRiskClients.length}
              </p>
              <p className="text-sm text-gray-500">Risque élevé</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">
                {DEMO_CLIENTS.filter((c) => c.riskScore < 30).length}
              </p>
              <p className="text-sm text-gray-500">Clients fidèles</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {DEMO_CLIENTS.length}
              </p>
              <p className="text-sm text-gray-500">Total clients</p>
            </CardContent>
          </Card>
        </div>

        {/* Critical alerts */}
        {criticalClients.length > 0 && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-5 h-5" />
                Alertes critiques - Action immédiate requise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criticalClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="font-bold text-red-600">
                          {client.riskScore}%
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {client.nom}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{client.ville}</span>
                          <span>•</span>
                          <span>CA: {formatCurrency(client.caAnnuel)}/an</span>
                          <span>•</span>
                          <span className="text-red-600">
                            {client.evolution}% vs N-1
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Phone className="w-4 h-4" />
                        Appeler
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 gap-1"
                        onClick={() => handleAnalyzeChurn(client.id)}
                        disabled={loadingAnalysis === client.id}
                      >
                        {loadingAnalysis === client.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                        {analyses[client.id] ? 'Voir analyse' : 'Analyser IA'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All at-risk clients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-600" />
              Tous les clients à surveiller ({clientsAtRisk.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Client
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      CA Annuel
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Évolution
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Score Risque
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Signaux
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {clientsAtRisk.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {client.nom}
                          </p>
                          <p className="text-sm text-gray-500">{client.ville}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="capitalize">
                          {client.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {formatCurrency(client.caAnnuel)}
                      </td>
                      <td className="px-4 py-3">
                        <div
                          className={`flex items-center gap-1 ${client.evolution < 0 ? 'text-red-600' : 'text-green-600'}`}
                        >
                          <TrendingDown
                            className={`w-4 h-4 ${client.evolution >= 0 ? 'rotate-180' : ''}`}
                          />
                          {client.evolution}%
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRiskColor(client.riskScore)}`}
                        >
                          {client.riskScore}% - {getRiskLabel(client.riskScore)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {client.evolution < -10 && (
                            <Badge
                              variant="destructive"
                              className="text-xs"
                            >
                              CA en baisse
                            </Badge>
                          )}
                          {client.riskScore >= 60 && (
                            <Badge variant="warning" className="text-xs">
                              Inactivité
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm">
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAnalyzeChurn(client.id)}
                            disabled={loadingAnalysis === client.id}
                            title="Analyser avec l'IA"
                          >
                            {loadingAnalysis === client.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : analyses[client.id] ? (
                              <Brain className="w-4 h-4 text-indigo-600" />
                            ) : (
                              <Sparkles className="w-4 h-4 text-indigo-600" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Modal */}
      {modalClientId && modalAnalysis && modalClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    Analyse IA - {modalClient.nom}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Analyse de risque churn
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setModalClientId(null)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Score & Niveau */}
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">
                    {modalAnalysis.score}
                  </div>
                  <div className="text-sm text-gray-500">Score risque</div>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full ${
                        modalAnalysis.score >= 70
                          ? 'bg-red-500'
                          : modalAnalysis.score >= 50
                            ? 'bg-orange-500'
                            : 'bg-yellow-500'
                      }`}
                      style={{ width: `${modalAnalysis.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                <Badge
                  className={`capitalize text-sm px-3 py-1 ${getNiveauColor(modalAnalysis.niveau)}`}
                >
                  {modalAnalysis.niveau}
                </Badge>
              </div>

              {/* Probabilité départ */}
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm font-medium text-red-800 mb-1">
                  Probabilité de départ dans 30 jours
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {modalAnalysis.probabilite_depart_30j}%
                </p>
              </div>

              {/* Résumé */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Résumé</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {modalAnalysis.resume}
                </p>
              </div>

              {/* Signaux */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Signaux détectés
                </h4>
                <div className="space-y-2">
                  {modalAnalysis.signaux.map((signal, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div
                        className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                          signal.impact >= 20
                            ? 'bg-red-500'
                            : signal.impact >= 10
                              ? 'bg-orange-500'
                              : 'bg-yellow-500'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {signal.signal}
                          </p>
                          <span className="text-xs text-gray-500">
                            Impact: +{signal.impact}pts
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {signal.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action recommandée */}
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-indigo-900 mb-1">
                      Action recommandée
                    </h4>
                    <p className="text-sm text-indigo-800">
                      {modalAnalysis.action_recommandee}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-3 pt-2">
                <Button className="flex-1 gap-2">
                  <Phone className="w-4 h-4" />
                  Appeler maintenant
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Calendar className="w-4 h-4" />
                  Planifier une visite
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
