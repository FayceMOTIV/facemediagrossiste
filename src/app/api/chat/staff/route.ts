export const runtime = 'nodejs';
export const maxDuration = 30;

import { streamText, type ModelMessage } from 'ai';
import { openaiProvider } from '@/services/ai/openai-service';
import { logAICall } from '@/services/ai/langfuse-client';
import { NextRequest } from 'next/server';
import { z } from 'zod';

const RequestSchema = z.object({
  messages: z.array(z.any()),
  userId: z.string().optional(),
  clientHistory: z.record(z.unknown()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, userId, clientHistory } = RequestSchema.parse(body);

    const system = `Tu es un assistant commercial IA expert pour DISTRAM, grossiste halal B2B foodservice.
Tu aides les commerciaux, managers et admin à :
- Préparer des visites et argumentaires de vente
- Analyser des clients et détecter des opportunités
- Générer des propositions commerciales et devis
- Comprendre les tendances du marché halal fast-food

CATALOGUE DISTRAM — Produits phares et marges :
Broche kebab bœuf/veau 10kg: 75€ (marge ~25%) | 15kg: 105€ | Poulet 10kg: 68€
Pain pita 16cm×100: 18€ | Galette durum 30cm×72: 20€ | Burger bun×50: 12€
Sauce kebab 10L: 25€ | Sauce blanche 10L: 22€ | Harissa 10L: 18€ | Sauce tacos 10L: 24€
Edam tranches 1kg: 8.50€ | Mozzarella râpée 2kg: 11€ | Fromage fondu burger 1kg: 9€
Frites classic 5kg×4: 28€ | Allumettes 5kg×4: 30€

STRATÉGIES COMMERCIALES :
- Kebab sans frites → upsell +180€/mois potentiel
- Client tacos sans sauce tacos maison → opportunité +60€/mois
- Pack complet (viande + pain + sauce) → remise 5% engagement
- Fidélisation Gold (CA > 5k€/mois) : remise 5% annuel
- Nouveaux clients : 1er commande avec livraison offerte > 300€

OBJECTIONS FRÉQUENTES :
- "C'est trop cher" → comparer qualité halal certifiée + fiabilité livraison
- "J'ai déjà un fournisseur" → différenciateur : délai 24h, 3 dépôts, app mobile suivi
- "Pas le temps" → commande en ligne + livraison sur créneau fixe

${clientHistory ? `Contexte client : ${JSON.stringify(clientHistory)}` : ''}

Réponds en français, sois concis et orienté résultats. Propose des actions concrètes.`;

    const result = await streamText({
      model: openaiProvider('gpt-4o-mini'),
      system,
      messages: messages as ModelMessage[],
      maxOutputTokens: 1500,
      onFinish: async ({ text, usage }) => {
        await logAICall(
          'chat-staff',
          'gpt-4o-mini',
          (messages[messages.length - 1] as { content?: string })?.content ?? '',
          text,
          { input: usage.inputTokens ?? 0, output: usage.outputTokens ?? 0 },
          userId
        ).catch(() => {});
      },
    });

    return result.toTextStreamResponse();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Service temporairement indisponible.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
