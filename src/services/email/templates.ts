export function devisEmailTemplate(params: {
  clientNom: string;
  devisNumero: string;
  montantHT: number;
  dateExpiration: string;
  commercialNom: string;
}): string {
  const { clientNom, devisNumero, montantHT, dateExpiration, commercialNom } = params;
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Devis ${devisNumero}</title></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
    <h1 style="color: #fff; margin: 0; font-size: 24px;">FastGross Pro</h1>
    <p style="color: #a0aec0; margin: 8px 0 0;">Votre devis est prêt</p>
  </div>
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
    <p>Bonjour <strong>${clientNom}</strong>,</p>
    <p>Veuillez trouver ci-joint votre devis <strong>${devisNumero}</strong>.</p>
    <div style="background: #fff; border-radius: 6px; padding: 20px; margin: 20px 0; border-left: 4px solid #3b82f6;">
      <p style="margin: 0; font-size: 14px; color: #6b7280;">Montant HT</p>
      <p style="margin: 4px 0 0; font-size: 28px; font-weight: bold; color: #1a1a2e;">${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(montantHT)}</p>
      <p style="margin: 8px 0 0; font-size: 13px; color: #9ca3af;">Valable jusqu'au ${dateExpiration}</p>
    </div>
    <p>Pour toute question, contactez votre commercial : <strong>${commercialNom}</strong></p>
    <p style="margin-top: 30px; font-size: 12px; color: #9ca3af;">
      © ${new Date().getFullYear()} FastGross Pro — Plateforme B2B Grossistes Halal
    </p>
  </div>
</body>
</html>`;
}

export function commandeConfirmationTemplate(params: {
  clientNom: string;
  commandeNumero: string;
  lignes: Array<{ produit: string; quantite: number; prix: number }>;
  totalHT: number;
  depot: string;
}): string {
  const { clientNom, commandeNumero, lignes, totalHT, depot } = params;
  const lignesHtml = lignes
    .map(l => `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${l.produit}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${l.quantite}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(l.prix)}</td>
    </tr>`)
    .join('');
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Confirmation commande ${commandeNumero}</title></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
    <h1 style="color: #fff; margin: 0;">Commande confirmée ✓</h1>
    <p style="color: #a0aec0; margin: 8px 0 0;">Référence : ${commandeNumero}</p>
  </div>
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
    <p>Bonjour <strong>${clientNom}</strong>,</p>
    <p>Votre commande a été enregistrée et sera préparée depuis notre dépôt <strong>${depot}</strong>.</p>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr style="background: #f3f4f6;">
          <th style="padding: 10px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase;">Produit</th>
          <th style="padding: 10px; text-align: center; font-size: 12px; color: #6b7280; text-transform: uppercase;">Qté</th>
          <th style="padding: 10px; text-align: right; font-size: 12px; color: #6b7280; text-transform: uppercase;">Prix HT</th>
        </tr>
      </thead>
      <tbody>${lignesHtml}</tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding: 12px; font-weight: bold; text-align: right;">Total HT</td>
          <td style="padding: 12px; font-weight: bold; text-align: right; color: #1a1a2e;">${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalHT)}</td>
        </tr>
      </tfoot>
    </table>
    <p style="margin-top: 30px; font-size: 12px; color: #9ca3af;">
      © ${new Date().getFullYear()} FastGross Pro
    </p>
  </div>
</body>
</html>`;
}
