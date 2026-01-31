'use client';

import { useState, useRef } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText,
  ShoppingCart,
  Sparkles,
  ArrowRight,
  Image as ImageIcon,
  Zap
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface DetectedProduct {
  ref: string;
  nom: string;
  quantite: number;
  unite: string;
  prixUnitaire: number;
  prixTotal: number;
}

interface ScanResult {
  platsDetectes: Array<{
    nom: string;
    quantiteEstimee: number;
    produitsNecessaires: DetectedProduct[];
  }>;
  totalHT: number;
  totalTTC: number;
  margeEstimee: number;
  tempsAnalyse: number;
}

export default function ScanMenuPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Demo result for showcase
  const demoResult: ScanResult = {
    platsDetectes: [
      {
        nom: 'Kebab classique',
        quantiteEstimee: 150,
        produitsNecessaires: [
          { ref: 'VIA-001', nom: 'Broche kebab boeuf/veau 10kg', quantite: 3, unite: 'pièce', prixUnitaire: 75, prixTotal: 225 },
          { ref: 'PAI-001', nom: 'Pain pita 16cm x100', quantite: 2, unite: 'carton', prixUnitaire: 18, prixTotal: 36 },
          { ref: 'SAU-001', nom: 'Sauce blanche 5L', quantite: 2, unite: 'bidon', prixUnitaire: 12, prixTotal: 24 },
        ]
      },
      {
        nom: 'French Tacos L',
        quantiteEstimee: 80,
        produitsNecessaires: [
          { ref: 'PAI-010', nom: 'Tortilla tacos 30cm x72', quantite: 2, unite: 'carton', prixUnitaire: 24, prixTotal: 48 },
          { ref: 'SAU-010', nom: 'Sauce fromagère 5L', quantite: 2, unite: 'bidon', prixUnitaire: 16, prixTotal: 32 },
          { ref: 'FRI-001', nom: 'Frites 9mm surgelées 10kg', quantite: 2, unite: 'carton', prixUnitaire: 14, prixTotal: 28 },
        ]
      },
      {
        nom: 'Burger Double',
        quantiteEstimee: 60,
        produitsNecessaires: [
          { ref: 'VIA-050', nom: 'Steak haché 100g x50', quantite: 3, unite: 'carton', prixUnitaire: 42, prixTotal: 126 },
          { ref: 'PAI-020', nom: 'Pain burger sésame x48', quantite: 2, unite: 'carton', prixUnitaire: 12, prixTotal: 24 },
          { ref: 'FRO-010', nom: 'Cheddar tranches x200', quantite: 1, unite: 'boîte', prixUnitaire: 18, prixTotal: 18 },
        ]
      },
    ],
    totalHT: 561,
    totalTTC: 673.20,
    margeEstimee: 68,
    tempsAnalyse: 2.3,
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));

    // In production, this would call the actual AI service
    // const base64 = selectedImage.split(',')[1];
    // const result = await analyzeMenuWithAI(base64);

    setResult(demoResult);
    setIsAnalyzing(false);
  };

  const handleCreateQuote = () => {
    // Navigate to quote creation with pre-filled data
    console.log('Creating quote with:', result);
  };

  const handleCreateOrder = () => {
    // Navigate to order creation with pre-filled data
    console.log('Creating order with:', result);
  };

  const allProducts = result?.platsDetectes.flatMap(p => p.produitsNecessaires) || [];

  return (
    <div className="min-h-screen">
      <Header
        title="IA Scan Menu"
        subtitle="Photographiez un menu, obtenez un devis en 30 secondes"
      />

      <div className="p-6">
        {/* Hero card */}
        <Card className="mb-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1">Comment ça marche ?</h2>
                <p className="text-orange-100">
                  1. Photographiez un menu → 2. L'IA identifie les plats → 3. Générez un devis personnalisé
                </p>
              </div>
              <div className="ml-auto hidden md:flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <Zap className="w-5 h-5" />
                <span className="font-medium">Temps moyen: 30 secondes</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-orange-600" />
                Télécharger un menu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileSelect}
              />

              {!selectedImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all"
                >
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-orange-600" />
                  </div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Cliquez pour télécharger
                  </p>
                  <p className="text-sm text-gray-500">
                    ou glissez-déposez une image de menu
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    PNG, JPG jusqu'à 10MB
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={selectedImage}
                      alt="Menu uploadé"
                      className="w-full h-64 object-contain"
                    />
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setResult(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <AlertCircle className="w-4 h-4" />
                    </button>
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full bg-orange-600 hover:bg-orange-700 gap-2"
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
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Résultats de l'analyse
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!result && !isAnalyzing && (
                <div className="text-center py-12 text-gray-500">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Téléchargez un menu pour commencer l'analyse</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                  </div>
                  <p className="text-gray-900 font-medium">Analyse du menu en cours...</p>
                  <p className="text-sm text-gray-500 mt-1">Identification des plats et calcul des quantités</p>
                </div>
              )}

              {result && (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">
                        Analyse terminée en {result.tempsAnalyse}s
                      </span>
                    </div>
                    <p className="text-sm text-green-700">
                      {result.platsDetectes.length} types de plats détectés, {allProducts.length} produits recommandés
                    </p>
                  </div>

                  {/* Detected dishes */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Plats détectés</h4>
                    <div className="space-y-2">
                      {result.platsDetectes.map((plat, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{plat.nom}</p>
                            <p className="text-sm text-gray-500">
                              ~{plat.quantiteEstimee} ventes/semaine estimées
                            </p>
                          </div>
                          <Badge>{plat.produitsNecessaires.length} produits</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(result.totalHT)}</p>
                        <p className="text-sm text-gray-500">Total HT</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(result.totalTTC)}</p>
                        <p className="text-sm text-gray-500">Total TTC</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{result.margeEstimee}%</p>
                        <p className="text-sm text-gray-500">Marge estimée</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handleCreateQuote}
                      variant="outline"
                      className="flex-1 gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Créer un devis
                    </Button>
                    <Button
                      onClick={handleCreateOrder}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Commander
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Products table */}
        {result && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Détail des produits recommandés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Réf</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantité</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unité</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">P.U. HT</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total HT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {allProducts.map((product, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono text-gray-500">{product.ref}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.nom}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">{product.quantite}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{product.unite}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(product.prixUnitaire)}</td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{formatCurrency(product.prixTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={5} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Total HT</td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">{formatCurrency(result.totalHT)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
