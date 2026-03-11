import { generateText } from 'ai';
import { openaiProvider } from '@/services/ai/openai-service';
import { logAICall } from '@/services/ai/langfuse-client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { kpis, depot, period, userId } = await req.json();

    const kpisData = kpis as Record<string, unknown>;

    const prompt = `Analyse ces KPIs business pour DISTRAM (${depot ?? 'tous dépôts'}) - Période: ${period ?? 'cette semaine'}:

CA total: ${kpisData.caMois ?? 0}€
Commandes: ${kpisData.commandesSemaine ?? 0}
Clients actifs: ${kpisData.clientsActifs ?? 0}
Clients à risque: ${kpisData.clientsARisque ?? 0}
Livraisons en cours: ${kpisData.livraisonsEnCours ?? 0}
Panier moyen: ${kpisData.panierMoyen ?? 0}€
Taux conversion: ${kpisData.tauxConversion ?? 0}%

Génère:
1. Un résumé exécutif en 3 points clés
2. 2-3 anomalies ou tendances à surveiller
3. 3 actions prioritaires recommandées pour cette semaine
4. Prévision CA semaine suivante basée sur les tendances

Réponds en français, sois concis et actionnable.`;

    const { text, usage } = await generateText({
      model: openaiProvider('gpt-4o-mini'),
      prompt,
      maxOutputTokens: 800,
    });

    await logAICall(
      'business-analyst',
      'gpt-4o-mini',
      prompt,
      text,
      {
        input: usage.inputTokens ?? 0,
        output: usage.outputTokens ?? 0,
      },
      userId as string | undefined
    );

    return NextResponse.json({
      analysis: text,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Business API error:', error);
    return NextResponse.json(
      { error: 'Erreur analyse business' },
      { status: 500 }
    );
  }
}
