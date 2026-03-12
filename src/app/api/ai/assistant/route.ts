export const runtime = 'nodejs';
export const maxDuration = 30;

import { streamText, type ModelMessage } from 'ai';
import { openaiProvider } from '@/services/ai/openai-service';
import { logAICall } from '@/services/ai/langfuse-client';
import { withRetry } from '@/lib/ai-retry';
import { NextRequest } from 'next/server';

const CATALOG_CONTEXT = `
CATALOGUE DISTRAM — Grossiste alimentaire halal (98 références) :
VIANDES : Broche kebab bœuf/veau 10kg (75€), 15kg (105€), Poulet 10kg (68€), Filet poulet 5kg (32€), Viande hachée 5kg (28€), Merguez 2kg (18.50€)
PAINS : Pita 16cm x100 (18€), Pita 20cm x80 (22€), Galette durum 30cm x72 (20€)
SAUCES : Kebab 10L (25€), Blanche 10L (22€), Harissa 10L (18€), Tacos 10L (24€)
FROMAGES : Edam tranches 1kg (8.50€), Mozzarella râpée 2kg (11€), Fromage fondu burger 1kg (9€)
LÉGUMES : Chou blanc (4€), Oignons 5kg (6€), Tomates 5kg (8€), Salade iceberg (5€)
FRITES : Classic 10mm 5kg×4 (28€), Allumettes 7mm 5kg×4 (30€), Ondulées (26€)
BOISSONS : Eau 1.5L×6 (4€), Soda 33cl×24 (12€)
`;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      messages: ModelMessage[];
      userId?: string;
      clientContext?: Record<string, unknown>;
    };

    const { messages, userId, clientContext } = body;

    const system = `Tu es un assistant commercial expert pour DISTRAM, grossiste alimentaire halal.
Tu aides les restaurants (kebabs, tacos, pizzerias, burgers) à commander et trouver les bons produits.

${CATALOG_CONTEXT}

${clientContext ? `Contexte client: ${JSON.stringify(clientContext)}` : ''}

Règles :
- Réponds toujours en français, sois concis et professionnel
- Si le client demande des prix, donne les tarifs DISTRAM ci-dessus
- Propose des quantités réalistes pour une semaine selon le type de restaurant
- Si tu détectes un besoin, propose des produits complémentaires`;

    const result = await withRetry(() =>
      Promise.resolve(
        streamText({
          model: openaiProvider('gpt-4o-mini'),
          system,
          messages,
          maxOutputTokens: 1000,
          onFinish: async ({ text, usage }) => {
            await logAICall(
              'assistant-client',
              'gpt-4o-mini',
              (messages[messages.length - 1]?.content as string) ?? '',
              text,
              { input: usage.inputTokens ?? 0, output: usage.outputTokens ?? 0 },
              userId
            ).catch(() => {});
          },
        })
      )
    );

    return result.toTextStreamResponse();
  } catch {
    return new Response(
      JSON.stringify({
        error: 'Service temporairement indisponible. Réessayez dans quelques secondes.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
