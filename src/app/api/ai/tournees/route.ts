export const runtime = 'nodejs';

import { generateObject } from 'ai';
import { openaiProvider } from '@/services/ai/openai-service';
import { logAICall } from '@/services/ai/langfuse-client';
import { withRetry } from '@/lib/ai-retry';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const DeliveryStopSchema = z.object({
  position: z.number(),
  orderId: z.string(),
  client: z.string(),
  adresse: z.string(),
  heureArriveeEstimee: z.string(),
  dureeArret: z.number(),
  poids: z.number(),
  priorite: z.string(),
  raisonOrdre: z.string(),
});

const TourneeOptimiseeSchema = z.object({
  arrets: z.array(DeliveryStopSchema),
  distanceTotaleKm: z.number(),
  dureeEstimeeMinutes: z.number(),
  economieCarburantPct: z.number(),
  notes: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const { depot, userId, date } = await req.json();

    const db = getAdminDb();

    // Fetch today's validated orders
    const targetDate = date ? new Date(date as string) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    let query = db.collection('orders')
      .where('status', '==', 'validee');

    if (depot) {
      query = query.where('depot', '==', depot) as typeof query;
    }

    const snapshot = await query.get();
    const orders = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Array<{
      id: string;
      clientId: string;
      clientNom: string;
      adresse?: string;
      totalHT: number;
      totalTTC: number;
      dateLivraison?: FirebaseFirestore.Timestamp;
      creneauLivraison?: string;
      notes?: string;
      [key: string]: unknown;
    }>;

    if (orders.length === 0) {
      return NextResponse.json(
        { error: 'Aucune livraison validée trouvée pour aujourd\'hui' },
        { status: 404 }
      );
    }

    const ordersDescription = orders.map((o, i) =>
      `${i + 1}. Commande ${o.id} - Client: ${o.clientNom} - Adresse: ${o.adresse ?? 'non renseignée'} - Montant: ${o.totalTTC}€ - Créneau: ${o.creneauLivraison ?? 'flexible'} - Notes: ${o.notes ?? 'aucune'}`
    ).join('\n');

    const prompt = `Tu es un optimiseur de tournées de livraison pour DISTRAM, grossiste à ${depot ?? 'Lyon'}.

Voici les ${orders.length} livraisons à effectuer aujourd'hui :

${ordersDescription}

Contraintes à respecter :
- Kebab et snack : créneau préférentiel 10h-11h30 (réception avant ouverture)
- Pizzeria : créneau préférentiel 16h-18h (avant le service du soir)
- Poids max camion : 1500 kg
- Priorité aux clients avec montant élevé ou notes urgentes
- Optimiser la distance kilométrique totale
- Estimer un poids de 50-150 kg par livraison selon le montant de commande
- Départ dépôt à 08h00

Génère l'ordre optimal de passage avec heures estimées d'arrivée, durée d'arrêt (15-25 min), et la raison du positionnement dans la tournée.`;

    const { object } = await withRetry(() =>
      generateObject({
        model: openaiProvider('gpt-4o-mini'),
        schema: TourneeOptimiseeSchema,
        prompt,
      })
    );

    await logAICall(
      'tournee-optimization',
      'gpt-4o-mini',
      prompt,
      JSON.stringify(object),
      undefined,
      userId as string | undefined
    );

    // Save tournee to Firestore
    const tourneeRef = await db.collection('tournees').add({
      depot: depot ?? 'lyon',
      date: FieldValue.serverTimestamp(),
      arrets: object.arrets,
      distanceTotaleKm: object.distanceTotaleKm,
      dureeEstimeeMinutes: object.dureeEstimeeMinutes,
      economieCarburantPct: object.economieCarburantPct,
      notes: object.notes,
      status: 'planifiee',
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ...object, tourneeId: tourneeRef.id });
  } catch {
    return NextResponse.json(
      { error: 'Erreur optimisation tournée' },
      { status: 500 }
    );
  }
}
