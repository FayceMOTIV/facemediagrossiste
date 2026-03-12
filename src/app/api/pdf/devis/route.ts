import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { DevisPDF } from '@/components/pdf/DevisPDF';
import { z } from 'zod';
import React from 'react';

const DevisPDFSchema = z.object({
  numero: z.string(),
  clientNom: z.string(),
  clientAdresse: z.string().optional(),
  dateCreation: z.string(),
  dateExpiration: z.string(),
  lignes: z.array(z.object({
    ref: z.string(),
    designation: z.string(),
    quantite: z.number(),
    prixUnitaireHT: z.number(),
    totalHT: z.number(),
  })),
  totalHT: z.number(),
  tva: z.number().default(0),
  totalTTC: z.number(),
  notes: z.string().optional(),
  commercialNom: z.string().optional(),
});

export type DevisPDFData = z.infer<typeof DevisPDFSchema>;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as unknown;
    const parsed = DevisPDFSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(React.createElement(DevisPDF, { data: parsed.data }) as any);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="devis-${parsed.data.numero}.pdf"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
  }
}
