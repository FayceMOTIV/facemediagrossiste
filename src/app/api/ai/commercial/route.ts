import { streamText, type ModelMessage } from 'ai';
import { googleProvider } from '@/services/ai/gemini-service';
import { openaiProvider } from '@/services/ai/openai-service';
import { logAICall } from '@/services/ai/langfuse-client';
import { withRetry } from '@/lib/ai-retry';
import { NextRequest } from 'next/server';

const UPSELL_STRATEGIES = `
STRATÉGIES UPSELL DISTRAM :
- Client kebab sans frites → opportunité +180€/mois
- Client tacos sans sauce tacos → opportunité +60€/mois
- Client qui commande viande sans pain → proposition pack complet -5%
- Fidélisation Gold (CA > 5k€/mois): remise 5% engagement annuel
- Fidélisation Silver (CA 2-5k€/mois): remise 3% engagement annuel
`;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      messages: ModelMessage[];
      userId?: string;
      clientHistory?: Record<string, unknown>;
    };

    const { messages, userId, clientHistory } = body;

    const systemPrompt = `Tu es un assistant commercial IA expert pour DISTRAM, grossiste halal B2B.
Tu aides les commerciaux à préparer leurs visites, générer des devis et identifier des opportunités.

CATALOGUE (produits phares) :
Broches kebab bœuf/veau 10kg: 75€ | 15kg: 105€ | Poulet 10kg: 68€
Pain pita 16cm×100: 18€ | Galette durum: 20€
Sauce kebab 10L: 25€ | Sauce blanche 10L: 22€ | Harissa 10L: 18€
Frites classic 5kg×4: 28€ | Allumettes 5kg×4: 30€

${UPSELL_STRATEGIES}

${clientHistory ? `Historique client: ${JSON.stringify(clientHistory)}` : ''}

Génère des devis précis avec références produits, quantités et prix HT.
Propose des stratégies d'upsell contextuelles. Réponds en français.`;

    const primaryModel = googleProvider('gemini-2.5-flash-lite-preview-06-17');
    const system = systemPrompt;
    let result;
    try {
      result = await withRetry(() =>
        Promise.resolve(
          streamText({
            model: primaryModel,
            system,
            messages,
            maxOutputTokens: 1500,
            onFinish: async ({ text, usage }) => {
              await logAICall(
                'assistant-commercial',
                'gemini-2.5-flash-lite',
                (messages[messages.length - 1]?.content as string) ?? '',
                text,
                { input: usage.inputTokens ?? 0, output: usage.outputTokens ?? 0 },
                userId
              ).catch(() => {});
            },
          })
        )
      );
    } catch {
      result = await withRetry(() =>
        Promise.resolve(
          streamText({
            model: openaiProvider('gpt-4o-mini'),
            system,
            messages,
            maxOutputTokens: 1500,
          })
        )
      );
    }

    return result.toTextStreamResponse();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Service temporairement indisponible.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
