export const runtime = 'nodejs';
export const maxDuration = 30;

import { streamText, type ModelMessage } from 'ai';
import { openaiProvider } from '@/services/ai/openai-service';
import { logAICall } from '@/services/ai/langfuse-client';
import { getAdminDb } from '@/lib/firebase-admin';
import { NextRequest } from 'next/server';
import { z } from 'zod';

const RequestSchema = z.object({
  messages: z.array(z.any()),
  userId: z.string().optional(),
});

const CATALOG_CONTEXT = `
CATALOGUE DISTRAM (extraits) :
VIANDES : Broche kebab bœuf/veau 10kg (75€), 15kg (105€), Poulet 10kg (68€), Filet poulet 5kg (32€), Merguez 2kg (18.50€)
PAINS : Pita 16cm x100 (18€), Galette durum 30cm x72 (20€)
SAUCES : Kebab 10L (25€), Blanche 10L (22€), Harissa 10L (18€), Tacos 10L (24€)
FROMAGES : Edam 1kg (8.50€), Mozzarella râpée 2kg (11€)
FRITES : Classic 5kg×4 (28€), Allumettes 5kg×4 (30€)
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, userId } = RequestSchema.parse(body);

    // Load client context from Firestore if userId provided
    let clientContext = '';
    if (userId) {
      try {
        const db = getAdminDb();
        const ordersSnap = await db
          .collection('orders')
          .where('clientId', '==', userId)
          .orderBy('createdAt', 'desc')
          .limit(5)
          .get();

        if (!ordersSnap.empty) {
          const orders = ordersSnap.docs.map((d) => {
            const data = d.data();
            return `Commande ${data.numero ?? d.id}: ${data.totalTTC ?? 0}€ TTC — ${data.status}`;
          });
          clientContext = `\nVos 5 dernières commandes :\n${orders.join('\n')}`;
        }
      } catch {
        // Ignore Firestore errors — continue without context
      }
    }

    const system = `Tu es un assistant DISTRAM, grossiste alimentaire halal.
Tu aides les restaurateurs à trouver les bons produits, passer des commandes et suivre leurs livraisons.

${CATALOG_CONTEXT}
${clientContext}

Règles :
- Réponds toujours en français, sois chaleureux et professionnel
- Aide à trouver des produits, calculer des quantités, suivre des commandes
- Propose des produits complémentaires selon le type de restaurant
- Pour toute commande : redirige vers l'onglet Commandes de l'application`;

    const result = await streamText({
      model: openaiProvider('gpt-4o-mini'),
      system,
      messages: messages as ModelMessage[],
      maxOutputTokens: 800,
      onFinish: async ({ text, usage }) => {
        // Persist to Firestore
        if (userId) {
          try {
            const db = getAdminDb();
            await db
              .collection('chat_sessions')
              .doc(userId)
              .collection('messages')
              .add({
                role: 'assistant',
                content: text,
                createdAt: new Date(),
              });
          } catch {
            // Ignore
          }
        }

        await logAICall(
          'chat-client',
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
