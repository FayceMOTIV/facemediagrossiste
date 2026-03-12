export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/services/email/email-service';
import { devisEmailTemplate, commandeConfirmationTemplate } from '@/services/email/templates';
import { z } from 'zod';

const DevisEmailSchema = z.object({
  type: z.literal('devis'),
  to: z.string().email(),
  clientNom: z.string(),
  devisNumero: z.string(),
  montantHT: z.number(),
  dateExpiration: z.string(),
  commercialNom: z.string(),
});

const CommandeEmailSchema = z.object({
  type: z.literal('commande'),
  to: z.string().email(),
  clientNom: z.string(),
  commandeNumero: z.string(),
  lignes: z.array(z.object({ produit: z.string(), quantite: z.number(), prix: z.number() })),
  totalHT: z.number(),
  depot: z.string(),
});

const EmailRequestSchema = z.discriminatedUnion('type', [DevisEmailSchema, CommandeEmailSchema]);

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as unknown;
    const parsed = EmailRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const data = parsed.data;
    let html = '';
    let subject = '';
    if (data.type === 'devis') {
      html = devisEmailTemplate(data);
      subject = `Votre devis ${data.devisNumero} — FastGross Pro`;
    } else {
      html = commandeConfirmationTemplate(data);
      subject = `Commande confirmée ${data.commandeNumero} — FastGross Pro`;
    }
    await sendEmail({ to: data.to, subject, html });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Email send failed' }, { status: 500 });
  }
}
