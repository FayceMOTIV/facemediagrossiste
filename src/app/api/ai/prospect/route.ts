export const runtime = 'nodejs';

import { generateObject } from 'ai';
import { openaiProvider } from '@/services/ai/openai-service';
import { logAICall } from '@/services/ai/langfuse-client';
import { withRetry } from '@/lib/ai-retry';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const ProspectSchema = z.object({
  score: z.number().min(0).max(100),
  scoreDetails: z.object({
    localisation: z.number(),
    potentielCA: z.number(),
    concurrence: z.number(),
    accessibilite: z.number(),
    reputation: z.number(),
  }),
  potentielCA: z.number(),
  recommandation: z.enum(['haute', 'moyenne', 'basse']),
  argumentsVente: z.array(z.string()).max(5),
  emailPersonnalise: z.string(),
});

export type ProspectAnalysis = z.infer<typeof ProspectSchema>;

export async function POST(req: NextRequest) {
  try {
    const { nom, type, adresse, telephone, avisGoogle, nombreAvis, userId } = await req.json();

    const prompt = `Tu es un expert commercial pour DISTRAM, grossiste alimentaire spécialisé dans les produits pour fast-food (kebab, tacos, pizza, burger).

Analyse le potentiel commercial de ce prospect :

Nom : ${nom}
Type : ${type}
Adresse : ${adresse}
Téléphone : ${telephone ?? 'non renseigné'}
Note Google : ${avisGoogle ?? 'inconnue'}/5
Nombre d'avis : ${nombreAvis ?? 'inconnu'}

Critères de scoring (total 100 pts) :
- localisation (0-25) : centre-ville / zone commerciale = fort potentiel accessibilité
- potentielCA (0-25) : type kebab/tacos = fort potentiel DISTRAM (viandes, pains, sauces)
- concurrence (0-25) : évalue la saturation du secteur selon l'adresse
- accessibilite (0-25) : facilité de livraison, stationnement estimé
- reputation (0-25) : note Google > 4.0 = établissement sérieux, > 100 avis = volume important

Note importante : les restaurants kebab et tacos sont les meilleurs clients DISTRAM car ils consomment nos produits phares (viandes halal, pains à kebab, sauces). Une note Google > 4.5 avec > 100 avis indique un établissement à fort volume.

Génère aussi un email de prospection personnalisé et professionnel (3-4 phrases max) signé par l'équipe commerciale DISTRAM.`;

    const { object } = await withRetry(() =>
      generateObject({
        model: openaiProvider('gpt-4o-mini'),
        schema: ProspectSchema,
        prompt,
      })
    );

    await logAICall(
      'prospect-analysis',
      'gpt-4o-mini',
      prompt,
      JSON.stringify(object),
      undefined,
      userId as string | undefined
    );

    // Extract ville from adresse (last meaningful part)
    const adresseParts = adresse.split(',');
    const ville = adresseParts[adresseParts.length - 1]?.trim().replace(/^\d{5}\s*/, '') ?? adresse;

    // Save prospect to Firestore
    const db = getAdminDb();
    await db.collection('prospects').add({
      nom,
      type,
      adresse,
      ville,
      telephone: telephone ?? '',
      score: object.score,
      scoreDetails: object.scoreDetails,
      potentielCA: object.potentielCA,
      recommandation: object.recommandation,
      argumentsVente: object.argumentsVente,
      emailGenere: object.emailPersonnalise,
      avisGoogle: avisGoogle ?? null,
      nombreAvis: nombreAvis ?? null,
      status: 'nouveau',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(object);
  } catch {
    return NextResponse.json(
      { error: 'Erreur analyse prospect' },
      { status: 500 }
    );
  }
}
