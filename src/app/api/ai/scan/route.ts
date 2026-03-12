export const runtime = 'nodejs';

import { generateObject } from 'ai';
import { openaiProvider } from '@/services/ai/openai-service';
import { logAICall } from '@/services/ai/langfuse-client';
import { withRetry } from '@/lib/ai-retry';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

const ScanSchema = z.object({
  restaurantType: z.enum(['kebab', 'tacos', 'pizza', 'burger', 'snack', 'autre']),
  platsDetectes: z
    .array(
      z.object({
        nom: z.string(),
        categorie: z.string(),
      })
    )
    .max(20),
  produitsDistramRecommandes: z
    .array(
      z.object({
        id: z.string(),
        nom: z.string(),
        quantiteEstimeeParSemaine: z.number().int().positive(),
        prixUnitaireHT: z.number().positive(),
        unite: z.string(),
      })
    )
    .max(15),
  totalEstimeHT: z.number().nonnegative(),
  confidence: z.number().min(0).max(1),
  notesCommercial: z.string().max(500),
});

export type ScanResult = z.infer<typeof ScanSchema>;

const DISTRAM_PRODUCTS = `
CATALOGUE DISTRAM (extraits) :
VIA-001: Broche kebab bœuf/veau 10kg — 75€/pièce
VIA-002: Broche kebab bœuf/veau 15kg — 105€/pièce
VIA-003: Broche kebab poulet 10kg — 68€/pièce
VIA-010: Filet poulet mariné 5kg — 32€/carton
VIA-011: Viande hachée halal 5kg — 28€/barquette
VIA-020: Merguez halal 2kg — 18.50€/barquette
VIA-050: Steak haché 100g×50 — 42€/carton
PAI-001: Pain pita 16cm×100 — 18€/carton
PAI-002: Pain pita 20cm×80 — 22€/carton
PAI-003: Galette durum 30cm×72 — 20€/carton
PAI-010: Burger bun×50 — 12€/sachet
SAU-001: Sauce kebab 10L — 25€
SAU-002: Sauce blanche 10L — 22€
SAU-003: Harissa 10L — 18€
SAU-004: Sauce tacos 10L — 24€
SAU-010: Ketchup 10L — 15€
FROM-001: Edam tranches 1kg — 8.50€
FROM-002: Mozzarella râpée 2kg — 11€
FROM-003: Fromage fondu burger 1kg — 9€
LEG-001: Chou blanc kg — 4€
LEG-002: Oignons 5kg — 6€
LEG-003: Tomates 5kg — 8€
FRI-001: Frites classic 10mm 5kg×4 — 28€/carton
FRI-002: Frites allumettes 7mm 5kg×4 — 30€/carton
BOI-001: Eau minérale 1.5L×6 — 4€
BOI-002: Soda 33cl×24 — 12€
`;

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, userId } = await req.json() as { imageUrl?: string; userId?: string };

    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl requis' }, { status: 400 });
    }

    const prompt = `Tu es un expert en restauration halal fast-food et en produits de grossiste alimentaire.

Analyse ce menu de restaurant et identifie :
1. Le type de restaurant (kebab, tacos, pizza, burger, snack, autre)
2. Les plats détectés sur le menu (max 20 plats)
3. Les produits DISTRAM recommandés pour réaliser ces plats

${DISTRAM_PRODUCTS}

Pour chaque produit recommandé :
- Utilise les IDs exacts du catalogue (VIA-001, etc.)
- Estime une quantité réaliste par semaine selon le volume supposé
- Un restaurant moyen kebab/tacos : 3 broches/semaine, 5 cartons frites/semaine
- Estime le total HT hebdomadaire

Si l'image est illisible ou ne montre pas de menu clairement, mets confidence < 0.3.`;

    const { object } = await withRetry(
      () =>
        generateObject({
          model: openaiProvider('gpt-4o'),
          schema: ScanSchema,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  image: imageUrl,
                },
                {
                  type: 'text',
                  text: prompt,
                },
              ],
            },
          ],
        }),
      { maxAttempts: 3, initialDelayMs: 1000 }
    );

    if (object.confidence < 0.3) {
      return NextResponse.json(
        { error: 'Image illisible ou menu non reconnu. Essayez avec une photo plus nette.' },
        { status: 400 }
      );
    }

    await logAICall(
      'scan-menu',
      'gpt-4o',
      `scan menu image: ${imageUrl}`,
      JSON.stringify(object),
      undefined,
      userId
    ).catch(() => {});

    return NextResponse.json(object);
  } catch {
    return NextResponse.json(
      { error: 'Erreur analyse menu' },
      { status: 500 }
    );
  }
}
