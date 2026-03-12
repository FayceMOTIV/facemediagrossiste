export const runtime = 'nodejs';

import { generateText } from 'ai';
import { openaiProvider } from '@/services/ai/openai-service';
import { logAICall } from '@/services/ai/langfuse-client';
import { NextRequest, NextResponse } from 'next/server';

interface BusinessKPIs {
  caMois?: number;
  commandesSemaine?: number;
  clientsActifs?: number;
  clientsARisque?: number;
  livraisonsEnCours?: number;
  panierMoyen?: number;
  tauxConversion?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      kpis: BusinessKPIs;
      depot?: string;
      period?: string;
      userId?: string;
    };

    const { kpis, depot, period, userId } = body;

    const prompt = `Analyse ces KPIs business pour DISTRAM (${depot ?? 'tous dépôts'}) — Période: ${period ?? 'cette semaine'}:

CA mensuel: ${kpis.caMois ?? 0}€
Commandes semaine: ${kpis.commandesSemaine ?? 0}
Clients actifs: ${kpis.clientsActifs ?? 0}
Clients à risque: ${kpis.clientsARisque ?? 0}
Livraisons en cours: ${kpis.livraisonsEnCours ?? 0}
Panier moyen: ${kpis.panierMoyen ?? 0}€
Taux conversion: ${kpis.tauxConversion ?? 0}%

Génère:
1. Résumé exécutif en 3 points clés
2. 2-3 anomalies ou tendances à surveiller
3. 3 actions prioritaires pour cette semaine
4. Prévision CA semaine suivante

Réponds en français, sois concis et actionnable.`;

    const result = await generateText({
      model: openaiProvider('gpt-4o-mini'),
      prompt,
      maxOutputTokens: 800,
    });

    await logAICall(
      'business-analyst',
      'gpt-4o-mini',
      prompt,
      result.text,
      {
        input: result.usage.inputTokens ?? 0,
        output: result.usage.outputTokens ?? 0,
      },
      userId
    ).catch(() => {});

    return NextResponse.json({
      analysis: result.text,
      model: 'gpt-4o-mini',
      generatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        error: 'Analyse temporairement indisponible. Réessayez dans quelques instants.',
      },
      { status: 500 }
    );
  }
}
