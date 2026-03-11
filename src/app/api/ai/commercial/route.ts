import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { openaiProvider } from '@/services/ai/openai-service';
import { logAICall } from '@/services/ai/langfuse-client';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: UIMessage[] = body.messages ?? [];
    const userId: string | undefined = body.userId;
    const clientHistory: unknown = body.clientHistory;

    const systemPrompt = `Tu es un assistant commercial IA expert pour DISTRAM, grossiste halal B2B.
Tu aides les commerciaux à préparer leurs visites, générer des devis et identifier des opportunités.

CATALOGUE DISTRAM (produits phares):
- Broches kebab bœuf/veau 10kg: 75€ | 15kg: 105€ | Poulet 10kg: 68€
- Pain pita 16cm x100: 18€ | Galette durum: 20€
- Sauce kebab 10L: 25€ | Sauce blanche 10L: 22€ | Harissa 10L: 18€
- Frites classic 5kg x4: 28€ | Allumettes 5kg x4: 30€

STRATÉGIES COMMERCIALES:
- Client kebab sans frites DISTRAM → opportunité +€180/mois
- Client tacos sans sauce tacos → opportunité +€60/mois
- Client qui commande de la viande mais pas le pain → proposition pack complet
- Fidélisation Gold/Silver: proposer remise 3-5% pour engagement annuel

${clientHistory ? `Historique client: ${JSON.stringify(clientHistory)}` : ''}

Génère des devis précis avec références produits, quantités et prix HT.
Propose des stratégies d'upsell contextuelles. Réponds en français.`;

    const modelMessages = await convertToModelMessages(messages);
    const lastUserMessage = messages.findLast((m) => m.role === 'user');
    const lastUserText =
      lastUserMessage?.parts.find((p) => p.type === 'text')?.text ?? '';

    const result = streamText({
      model: openaiProvider('gpt-4o'),
      system: systemPrompt,
      messages: modelMessages,
      maxOutputTokens: 1500,
      onFinish: async ({ text, usage }) => {
        await logAICall(
          'commercial-assistant',
          'gpt-4o',
          lastUserText,
          text,
          {
            input: usage.inputTokens ?? 0,
            output: usage.outputTokens ?? 0,
          },
          userId
        );
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Commercial API error:', error);
    return new Response('Erreur interne', { status: 500 });
  }
}
