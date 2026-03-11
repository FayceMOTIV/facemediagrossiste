import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { openaiProvider } from '@/services/ai/openai-service';
import { logAICall } from '@/services/ai/langfuse-client';
import { NextRequest } from 'next/server';

// DISTRAM catalog summary for system prompt
const CATALOG_SUMMARY = `
CATALOGUE DISTRAM - Produits disponibles:
- Viandes: Broches kebab boeuf/veau (10kg à 75€, 15kg à 105€), Poulet mariné, Viande hachée halal, Merguez
- Pains: Pita 16cm x100 (18€), Pita 20cm x80 (22€), Galette durum 30cm x72 (20€)
- Sauces: Sauce kebab, Sauce blanche, Harissa, Sauce tacos
- Fromages: Edam tranches, Mozzarella râpée, Fromage fondu burger
- Légumes: Chou blanc, Oignons, Tomates, Salade, Concombre
- Frites: Classic 10mm 5kg, Allumettes 7mm 5kg, Ondulées
- Boissons: Eau plate/gazeuse, Soda
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: UIMessage[] = body.messages ?? [];
    const userId: string | undefined = body.userId;
    const clientContext: unknown = body.clientContext;

    const systemPrompt = `Tu es un assistant commercial expert pour DISTRAM, grossiste alimentaire halal.
Tu aides les restaurants (kebabs, tacos, pizzerias, burgers) à passer leurs commandes et trouver les bons produits.

${CATALOG_SUMMARY}

${clientContext ? `Contexte client: ${JSON.stringify(clientContext)}` : ''}

Réponds toujours en français. Sois concis et professionnel.
Si le client demande des prix, donne les tarifs DISTRAM.
Si tu suggères des produits, propose des quantités réalistes pour une semaine.
`;

    const modelMessages = await convertToModelMessages(messages);
    const lastUserMessage = messages.findLast((m) => m.role === 'user');
    const lastUserText =
      lastUserMessage?.parts.find((p) => p.type === 'text')?.text ?? '';

    const result = streamText({
      model: openaiProvider('gpt-4o'),
      system: systemPrompt,
      messages: modelMessages,
      maxOutputTokens: 1000,
      onFinish: async ({ text, usage }) => {
        await logAICall(
          'assistant-commercial',
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
    console.error('Assistant API error:', error);
    return new Response('Erreur interne', { status: 500 });
  }
}
