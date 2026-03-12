export const runtime = 'nodejs';

import { generateObject } from 'ai';
import { openaiProvider } from '@/services/ai/openai-service';
import { logAICall } from '@/services/ai/langfuse-client';
import { withRetry } from '@/lib/ai-retry';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

const ChurnAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  niveau: z.enum(['faible', 'modere', 'eleve', 'critique']),
  resume: z.string(),
  action_recommandee: z.string(),
  signaux: z.array(
    z.object({
      signal: z.string(),
      impact: z.number(),
      description: z.string(),
    })
  ),
  probabilite_depart_30j: z.number().min(0).max(100),
});

export type ChurnAnalysis = z.infer<typeof ChurnAnalysisSchema>;

function calculateBaseScore(clientData: Record<string, unknown>): number {
  let score = 0;
  const now = new Date();

  // Last order > 14 days
  if (clientData.lastOrderDate) {
    const lastOrder = new Date(clientData.lastOrderDate as string);
    const daysSince =
      (now.getTime() - lastOrder.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince > 30) score += 35;
    else if (daysSince > 14) score += 25;
    else if (daysSince > 7) score += 10;
  }

  // Average order value decline
  if (
    (clientData.recentAvgOrder as number) <
    (clientData.historicAvgOrder as number) * 0.8
  )
    score += 25;

  // Unanswered quotes
  if ((clientData.unansweredQuotes as number) >= 2) score += 20;

  // Recent commercial change
  if (clientData.recentCommercialChange) score += 10;

  return Math.min(score, 100);
}

export async function POST(req: NextRequest) {
  try {
    const { clientId, clientData, userId } = await req.json();

    const baseScore = calculateBaseScore(
      clientData as Record<string, unknown>
    );

    const prompt = `Analyse le risque de churn de ce client restaurateur:

Nom: ${(clientData as Record<string, unknown>).nom}
Type: ${(clientData as Record<string, unknown>).type}
Score base calculé: ${baseScore}/100
Dernière commande: ${(clientData as Record<string, unknown>).lastOrderDate ?? 'inconnue'}
Panier moyen récent: ${(clientData as Record<string, unknown>).recentAvgOrder ?? 0}€ (historique: ${(clientData as Record<string, unknown>).historicAvgOrder ?? 0}€)
Fréquence commandes: ${(clientData as Record<string, unknown>).frequenceCommande}
Devis sans réponse: ${(clientData as Record<string, unknown>).unansweredQuotes ?? 0}
Changement commercial récent: ${(clientData as Record<string, unknown>).recentCommercialChange ? 'oui' : 'non'}
Notes: ${(clientData as Record<string, unknown>).notes ?? 'aucune'}

Génère une analyse détaillée du risque de churn avec score final, actions recommandées et signaux détectés.`;

    const { object } = await withRetry(() =>
      generateObject({
        model: openaiProvider('gpt-4o-mini'),
        schema: ChurnAnalysisSchema,
        prompt,
      })
    );

    await logAICall(
      'churn-analysis',
      'gpt-4o-mini',
      prompt,
      JSON.stringify(object),
      undefined,
      userId as string | undefined
    );

    return NextResponse.json({ ...object, clientId });
  } catch {
    return NextResponse.json(
      { error: 'Erreur analyse churn' },
      { status: 500 }
    );
  }
}
