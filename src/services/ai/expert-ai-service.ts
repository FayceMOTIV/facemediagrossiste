import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ═══════════════════════════════════════════════════════════════
// DONNÉES CATALOGUE DISTRAM (RÉELLES)
// ═══════════════════════════════════════════════════════════════

export const CATALOGUE_DISTRAM = {
  // VIANDES
  'broche-kebab-10kg': { nom: 'Broche kebab boeuf/veau 10kg', prix: 75.00, unite: 'pièce', ref: 'VIA-001', categorie: 'viandes' },
  'broche-kebab-15kg': { nom: 'Broche kebab boeuf/veau 15kg', prix: 105.00, unite: 'pièce', ref: 'VIA-002', categorie: 'viandes' },
  'broche-poulet-10kg': { nom: 'Broche kebab poulet 10kg', prix: 68.00, unite: 'pièce', ref: 'VIA-003', categorie: 'viandes' },
  'poulet-marine-5kg': { nom: 'Filet de poulet mariné 5kg', prix: 32.00, unite: 'carton', ref: 'VIA-010', categorie: 'viandes' },
  'viande-hachee-5kg': { nom: 'Viande hachée halal 5kg', prix: 28.00, unite: 'barquette', ref: 'VIA-011', categorie: 'viandes' },
  'merguez-barquette': { nom: 'Merguez halal barquette 2kg', prix: 18.50, unite: 'barquette', ref: 'VIA-020', categorie: 'viandes' },
  'cordon-bleu-1kg': { nom: 'Cordon bleu halal 1kg', prix: 9.50, unite: 'sachet', ref: 'VIA-030', categorie: 'viandes' },
  'escalope-poulet-5kg': { nom: 'Escalope de poulet halal 5kg', prix: 35.00, unite: 'carton', ref: 'VIA-040', categorie: 'viandes' },
  'steak-hache-100g-x50': { nom: 'Steak haché 100g x50', prix: 42.00, unite: 'carton', ref: 'VIA-050', categorie: 'viandes' },
  'saucisse-poulet-2kg': { nom: 'Saucisse de poulet halal 2kg', prix: 16.00, unite: 'barquette', ref: 'VIA-060', categorie: 'viandes' },

  // PAINS
  'pain-pita-16cm-x100': { nom: 'Pain pita 16cm x100', prix: 18.00, unite: 'carton', ref: 'PAI-001', categorie: 'pains' },
  'pain-pita-20cm-x80': { nom: 'Pain pita 20cm x80', prix: 22.00, unite: 'carton', ref: 'PAI-002', categorie: 'pains' },
  'galette-durum-x72': { nom: 'Galette durum 30cm x72', prix: 20.00, unite: 'carton', ref: 'PAI-003', categorie: 'pains' },
  'tortilla-30cm-x72': { nom: 'Tortilla tacos 30cm x72', prix: 24.00, unite: 'carton', ref: 'PAI-010', categorie: 'pains' },
  'pain-burger-x48': { nom: 'Pain burger sésame x48', prix: 12.00, unite: 'carton', ref: 'PAI-020', categorie: 'pains' },
  'pain-panini-x40': { nom: 'Pain panini x40', prix: 14.00, unite: 'carton', ref: 'PAI-021', categorie: 'pains' },
  'pain-baguette-x20': { nom: 'Pain baguette précuit x20', prix: 10.00, unite: 'carton', ref: 'PAI-030', categorie: 'pains' },
  'naan-x50': { nom: 'Pain naan nature x50', prix: 16.00, unite: 'carton', ref: 'PAI-040', categorie: 'pains' },

  // SAUCES
  'sauce-blanche-5L': { nom: 'Sauce blanche 5L', prix: 12.00, unite: 'bidon', ref: 'SAU-001', categorie: 'sauces' },
  'sauce-samourai-5L': { nom: 'Sauce samouraï 5L', prix: 14.00, unite: 'bidon', ref: 'SAU-002', categorie: 'sauces' },
  'sauce-algerienne-5L': { nom: 'Sauce algérienne 5L', prix: 13.00, unite: 'bidon', ref: 'SAU-003', categorie: 'sauces' },
  'sauce-harissa-5L': { nom: 'Sauce harissa 5L', prix: 11.00, unite: 'bidon', ref: 'SAU-004', categorie: 'sauces' },
  'sauce-fromagere-5L': { nom: 'Sauce fromagère 5L', prix: 16.00, unite: 'bidon', ref: 'SAU-010', categorie: 'sauces' },
  'ketchup-5L': { nom: 'Ketchup 5L', prix: 8.00, unite: 'bidon', ref: 'SAU-020', categorie: 'sauces' },
  'mayonnaise-5L': { nom: 'Mayonnaise 5L', prix: 10.00, unite: 'bidon', ref: 'SAU-021', categorie: 'sauces' },
  'sauce-tomate-5L': { nom: 'Sauce tomate pizza 5L', prix: 9.00, unite: 'bidon', ref: 'SAU-030', categorie: 'sauces' },
  'sauce-biggy-5L': { nom: 'Sauce Biggy Burger 5L', prix: 13.00, unite: 'bidon', ref: 'SAU-040', categorie: 'sauces' },
  'sauce-bbq-5L': { nom: 'Sauce BBQ 5L', prix: 12.00, unite: 'bidon', ref: 'SAU-050', categorie: 'sauces' },

  // FROMAGES
  'emmental-rape-2.5kg': { nom: 'Emmental râpé 2.5kg', prix: 14.00, unite: 'sachet', ref: 'FRO-001', categorie: 'fromages' },
  'mozzarella-pizza-2.5kg': { nom: 'Mozzarella pizza 2.5kg', prix: 16.00, unite: 'sachet', ref: 'FRO-002', categorie: 'fromages' },
  'cheddar-slices-x200': { nom: 'Cheddar tranches x200', prix: 18.00, unite: 'boîte', ref: 'FRO-010', categorie: 'fromages' },
  'feta-cubes-2kg': { nom: 'Feta cubes 2kg', prix: 22.00, unite: 'seau', ref: 'FRO-020', categorie: 'fromages' },
  'raclette-tranches-1kg': { nom: 'Raclette tranches 1kg', prix: 12.00, unite: 'sachet', ref: 'FRO-030', categorie: 'fromages' },

  // LÉGUMES
  'oignons-frits-2kg': { nom: 'Oignons frits 2kg', prix: 9.00, unite: 'sachet', ref: 'LEG-001', categorie: 'legumes' },
  'salade-iceberg-6kg': { nom: 'Salade iceberg émincée 6kg', prix: 12.00, unite: 'carton', ref: 'LEG-002', categorie: 'legumes' },
  'tomates-rondelles-5kg': { nom: 'Tomates rondelles 5kg', prix: 14.00, unite: 'carton', ref: 'LEG-003', categorie: 'legumes' },
  'cornichons-5kg': { nom: 'Cornichons tranchés 5kg', prix: 16.00, unite: 'seau', ref: 'LEG-010', categorie: 'legumes' },
  'olives-noires-5kg': { nom: 'Olives noires dénoyautées 5kg', prix: 24.00, unite: 'seau', ref: 'LEG-020', categorie: 'legumes' },
  'poivrons-grilles-2kg': { nom: 'Poivrons grillés 2kg', prix: 18.00, unite: 'bocal', ref: 'LEG-030', categorie: 'legumes' },
  'champignons-3kg': { nom: 'Champignons émincés 3kg', prix: 14.00, unite: 'boîte', ref: 'LEG-040', categorie: 'legumes' },

  // FRITES/ACCOMPAGNEMENTS
  'frites-9mm-10kg': { nom: 'Frites 9mm surgelées 10kg', prix: 14.00, unite: 'carton', ref: 'FRI-001', categorie: 'frites' },
  'frites-7mm-10kg': { nom: 'Frites allumettes 7mm 10kg', prix: 15.00, unite: 'carton', ref: 'FRI-002', categorie: 'frites' },
  'potatoes-10kg': { nom: 'Potatoes surgelées 10kg', prix: 16.00, unite: 'carton', ref: 'FRI-003', categorie: 'frites' },
  'nuggets-1kg': { nom: 'Nuggets poulet halal 1kg', prix: 8.00, unite: 'sachet', ref: 'FRI-010', categorie: 'frites' },
  'tenders-1kg': { nom: 'Tenders poulet halal 1kg', prix: 9.50, unite: 'sachet', ref: 'FRI-011', categorie: 'frites' },
  'onion-rings-1kg': { nom: 'Onion rings 1kg', prix: 7.50, unite: 'sachet', ref: 'FRI-020', categorie: 'frites' },
  'mozzarella-sticks-1kg': { nom: 'Mozzarella sticks 1kg', prix: 11.00, unite: 'sachet', ref: 'FRI-030', categorie: 'frites' },

  // BOISSONS
  'coca-33cl-x24': { nom: 'Coca-Cola 33cl x24', prix: 18.00, unite: 'pack', ref: 'BOI-001', categorie: 'boissons' },
  'eau-50cl-x24': { nom: 'Eau minérale 50cl x24', prix: 6.00, unite: 'pack', ref: 'BOI-002', categorie: 'boissons' },
  'ice-tea-33cl-x24': { nom: 'Ice Tea 33cl x24', prix: 16.00, unite: 'pack', ref: 'BOI-010', categorie: 'boissons' },
  'ayran-25cl-x24': { nom: 'Ayran 25cl x24', prix: 14.00, unite: 'pack', ref: 'BOI-020', categorie: 'boissons' },
  'fanta-33cl-x24': { nom: 'Fanta Orange 33cl x24', prix: 17.00, unite: 'pack', ref: 'BOI-030', categorie: 'boissons' },
  'sprite-33cl-x24': { nom: 'Sprite 33cl x24', prix: 17.00, unite: 'pack', ref: 'BOI-040', categorie: 'boissons' },
};

// ═══════════════════════════════════════════════════════════════
// GRAMMAGES PAR PLAT (VÉRIFIÉS)
// ═══════════════════════════════════════════════════════════════

export const GRAMMAGES_PLATS = {
  'kebab-classique': {
    viande: 150, pain: 1, salade: 50, tomate: 30, oignon: 10, sauce: 30,
    coutMatiere: 1.35, prixVenteMoyen: 7.50
  },
  'kebab-galette': {
    viande: 180, galette: 1, salade: 60, tomate: 40, oignon: 15, sauce: 40, frites: 100,
    coutMatiere: 2.10, prixVenteMoyen: 9.00
  },
  'french-tacos-M': {
    viande: 100, tortilla: 1, frites: 80, sauceFromagere: 60,
    coutMatiere: 1.98, prixVenteMoyen: 8.50
  },
  'french-tacos-L': {
    viande: 150, tortilla: 2, frites: 120, sauceFromagere: 80,
    coutMatiere: 2.97, prixVenteMoyen: 11.00
  },
  'french-tacos-XL': {
    viande: 200, tortilla: 2, frites: 150, sauceFromagere: 100,
    coutMatiere: 3.85, prixVenteMoyen: 13.50
  },
  'pizza-33cm': {
    pate: 250, sauce: 80, mozzarella: 150, garniture: 100,
    coutMatiere: 2.52, prixVenteMoyen: 12.00
  },
  'burger-classic': {
    viande: 150, pain: 1, fromage: 30, salade: 20, tomate: 30, sauce: 25,
    coutMatiere: 2.15, prixVenteMoyen: 9.00
  },
  'burger-double': {
    viande: 300, pain: 1, fromage: 60, salade: 20, tomate: 30, sauce: 40,
    coutMatiere: 3.80, prixVenteMoyen: 12.50
  },
  'assiette-kebab': {
    viande: 200, frites: 200, salade: 80, sauce: 50,
    coutMatiere: 2.80, prixVenteMoyen: 11.00
  },
};

// ═══════════════════════════════════════════════════════════════
// COEFFICIENTS SAISONNIERS
// ═══════════════════════════════════════════════════════════════

export const SAISONNALITE_MOIS: Record<string, number> = {
  janvier: 0.85, fevrier: 0.88, mars: 0.95, avril: 1.00,
  mai: 1.05, juin: 1.15, juillet: 1.10, aout: 0.75,
  septembre: 1.05, octobre: 1.00, novembre: 0.95, decembre: 1.20
};

export const SAISONNALITE_SEMAINE: Record<string, number> = {
  lundi: 0.85, mardi: 0.90, mercredi: 0.95, jeudi: 1.05,
  vendredi: 1.25, samedi: 1.35, dimanche: 0.65
};

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface ScanMenuResult {
  platsDetectes: Array<{
    nom: string;
    quantiteEstimee: number;
    produitsNecessaires: Array<{
      ref: string;
      nom: string;
      quantite: number;
      unite: string;
      prixUnitaire: number;
      prixTotal: number;
    }>;
  }>;
  totalHT: number;
  totalTTC: number;
  margeEstimee: number;
  tempsAnalyse: number;
}

export interface ProspectData {
  nom: string;
  type: string;
  adresse: string;
  telephone?: string;
  avisGoogle?: number;
  nombreAvis?: number;
  prixMoyen?: string;
}

export interface ProspectionResult {
  score: number;
  scoreDetails: {
    localisation: number;
    potentielCA: number;
    concurrence: number;
    accessibilite: number;
    reputation: number;
  };
  potentielCA: number;
  recommandation: 'haute' | 'moyenne' | 'basse';
  argumentsVente: string[];
  emailPersonnalise: string;
  prochainContact: string;
}

export interface ClientData {
  id: string;
  nom: string;
  caAnnuel: number;
  frequenceCommande: string;
  dernierCommande: Date;
  evolutionCA: number;
  reclamations: number;
  retardsPaiement: number;
  anciennete: number;
}

export interface ChurnAnalysis {
  riskScore: number;
  riskLevel: 'critique' | 'élevé' | 'modéré' | 'faible';
  signauxAlerte: string[];
  probabiliteDepart: number;
  dateDepartEstimee: string;
  actionsRecommandees: Array<{
    action: string;
    priorite: 'haute' | 'moyenne' | 'basse';
    responsable: string;
    delai: string;
  }>;
  argumentsRetention: string[];
  offreSpeciale: string;
}

export interface Delivery {
  clientId: string;
  clientNom: string;
  adresse: string;
  coordonnees: { lat: number; lng: number };
  creneauPreferentiel: string;
  typeEtablissement: string;
  poidsEstime: number;
  priorite: number;
}

export interface OptimizedRoute {
  ordreVisite: Array<{
    position: number;
    client: string;
    adresse: string;
    heureArriveeEstimee: string;
    dureeArret: number;
    notes: string;
  }>;
  distanceTotale: number;
  dureeEstimee: number;
  economieVsNaif: number;
  alertes: string[];
}

export interface Product {
  ref: string;
  nom: string;
  stockActuel: number;
  stockMinimum: number;
  consommationMoyenne: number;
  dlc?: Date;
  dernierReassort: Date;
}

export interface StockPrediction {
  alertes: Array<{
    ref: string;
    nom: string;
    type: 'rupture' | 'dlc' | 'surstock';
    dateEstimee: string;
    joursRestants: number;
    quantiteRecommandee: number;
    priorite: 'critique' | 'haute' | 'moyenne';
  }>;
  commandesSuggerees: Array<{
    ref: string;
    nom: string;
    quantite: number;
    motif: string;
  }>;
  economiesPotentielles: number;
}

export interface SalesContext {
  client: {
    nom: string;
    type: string;
    historique: string[];
    dernierAchat: string[];
    reclamations?: string[];
  };
  situation: 'prospection' | 'visite_client' | 'negociation' | 'reclamation' | 'reactivation';
  objectif: string;
}

export interface SalesAdvice {
  analyse: string;
  opportunitesCrosselling: Array<{
    produit: string;
    argumentaire: string;
    potentielCA: number;
  }>;
  reponsesObjections: Array<{
    objection: string;
    reponse: string;
  }>;
  techniquesClosing: string[];
  piecesEviter: string[];
  prochainContact: {
    delai: string;
    motif: string;
    preparation: string[];
  };
}

// ═══════════════════════════════════════════════════════════════
// 1. ⭐ IA SCAN MENU - Photo menu → Devis en 30s
// ═══════════════════════════════════════════════════════════════

export async function analyzeMenuWithAI(imageBase64: string): Promise<ScanMenuResult> {
  const startTime = Date.now();

  const systemPrompt = `Tu es un expert en restauration rapide et distribution alimentaire.

CATALOGUE DISTRAM DISPONIBLE:
${JSON.stringify(CATALOGUE_DISTRAM, null, 2)}

GRAMMAGES PAR PLAT:
${JSON.stringify(GRAMMAGES_PLATS, null, 2)}

MISSION: Analyse le menu photographié et génère une liste de produits DISTRAM nécessaires.

Pour chaque plat du menu:
1. Identifie le type de plat (kebab, tacos, pizza, burger...)
2. Estime les ventes hebdomadaires (petit resto: 50-100, moyen: 100-200, grand: 200-400)
3. Calcule les quantités de matières premières nécessaires
4. Associe les produits du catalogue DISTRAM avec les bonnes références

IMPORTANT:
- Utilise UNIQUEMENT les références du catalogue DISTRAM
- Calcule les quantités pour 1 SEMAINE de service
- Arrondis les quantités à l'unité de commande supérieure

Réponds en JSON avec la structure:
{
  "platsDetectes": [...],
  "totalHT": number,
  "totalTTC": number,
  "margeEstimee": number
}`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.2-90b-vision-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyse ce menu et génère la liste des produits DISTRAM nécessaires pour une semaine. Réponds en JSON.' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
          ] as unknown as string
        }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 4000,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    return {
      ...result,
      tempsAnalyse: (Date.now() - startTime) / 1000,
    };
  } catch (error) {
    console.error('Erreur analyse menu:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// 2. 🎯 IA PROSPECTION - Trouver nouveaux clients
// ═══════════════════════════════════════════════════════════════

export async function analyzeProspect(prospect: ProspectData): Promise<ProspectionResult> {
  const systemPrompt = `Tu es un expert commercial en distribution alimentaire B2B pour le secteur foodservice.

CONTEXTE DISTRAM:
- Grossiste alimentaire halal Lyon/Montpellier/Bordeaux
- Spécialiste kebab, tacos, snacking
- 487 clients actifs
- Panier moyen: 485€/commande
- Fréquence: bi-hebdomadaire

OBJECTIF: Analyse ce prospect et génère un scoring sur 100 points.

CRITÈRES DE SCORING:
1. Localisation (20 pts): proximité dépôt, zone de livraison
2. Potentiel CA (25 pts): taille estimée, fréquentation
3. Concurrence (20 pts): déjà client concurrent? facilité conversion
4. Accessibilité (15 pts): livraison facile, parking
5. Réputation (20 pts): avis Google, ancienneté

CALCUL POTENTIEL CA:
- Petit resto: 800-1500€/mois
- Moyen resto: 1500-3000€/mois
- Grand resto/chaîne: 3000-6000€/mois

Génère aussi un email de prospection personnalisé et les arguments de vente.

Réponds en JSON.`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyse ce prospect:\n${JSON.stringify(prospect, null, 2)}\n\nRéponds en JSON.` }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2000,
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Erreur analyse prospect:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// 3. 🛡️ IA ANTI-CHURN - Détecter clients à risque
// ═══════════════════════════════════════════════════════════════

export async function analyzeChurnRisk(client: ClientData): Promise<ChurnAnalysis> {
  const systemPrompt = `Tu es un expert en rétention client B2B pour la distribution alimentaire.

INDICATEURS SECTEUR FOODSERVICE:
- Taux churn moyen B2B: 8-15%/an
- Coût acquisition vs rétention: 5-7x plus cher d'acquérir
- Impact rétention +5%: +25% à +95% de profit

SIGNAUX D'ALERTE (par ordre d'importance):
1. Baisse fréquence commandes > 20%
2. Baisse panier moyen > 15%
3. Augmentation réclamations
4. Retards paiement répétés
5. Plus de contact depuis > 2 semaines
6. Commandes chez concurrent détectées

CALCUL SCORE RISQUE:
- 0-25: Faible risque (client fidèle)
- 26-50: Risque modéré (surveillance)
- 51-75: Risque élevé (action requise)
- 76-100: Critique (intervention immédiate)

Génère des actions concrètes avec responsables et délais.

Réponds en JSON.`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyse le risque churn de ce client:\n${JSON.stringify(client, null, 2)}\n\nRéponds en JSON.` }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2000,
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Erreur analyse churn:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// 4. 🗺️ IA TOURNÉES - Optimiser routes livreurs
// ═══════════════════════════════════════════════════════════════

export async function optimizeDeliveryRoute(deliveries: Delivery[]): Promise<OptimizedRoute> {
  const systemPrompt = `Tu es un expert en optimisation logistique pour la livraison foodservice.

CONTRAINTES CRÉNEAUX PAR TYPE:
- Kebab/Tacos/Snack: 10h-11h30 ou 16h-17h30 (avant service)
- Restaurant traditionnel: 7h-9h ou 14h-16h
- Pizzeria: 10h-12h ou 16h-18h
- Boulangerie: 5h-7h (très tôt)
- Hôtel/Collectivité: 6h-8h ou 14h-16h

RÈGLES D'OPTIMISATION:
1. Respecter les créneaux préférentiels (+/- 30min)
2. Minimiser la distance totale
3. Regrouper par zone géographique
4. Tenir compte du poids (commencer par les lourds si camion plein)
5. Priorité aux clients à risque churn

CAPACITÉ CAMION: 1500kg max
VITESSE MOYENNE: 25km/h en ville, 50km/h périphérie

Génère l'ordre optimal des livraisons avec heures estimées.

Réponds en JSON.`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Optimise cette tournée de livraison:\n${JSON.stringify(deliveries, null, 2)}\n\nRéponds en JSON.` }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 3000,
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Erreur optimisation tournée:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// 5. 📦 IA STOCKS - Prédire ruptures
// ═══════════════════════════════════════════════════════════════

export async function predictStockNeeds(products: Product[]): Promise<StockPrediction> {
  const now = new Date();
  const moisActuel = now.toLocaleString('fr-FR', { month: 'long' }).toLowerCase();
  const jourActuel = now.toLocaleString('fr-FR', { weekday: 'long' }).toLowerCase();

  const coeffMois = SAISONNALITE_MOIS[moisActuel] || 1;
  const coeffJour = SAISONNALITE_SEMAINE[jourActuel] || 1;

  const systemPrompt = `Tu es un expert en gestion des stocks pour grossiste alimentaire.

COEFFICIENTS SAISONNIERS ACTUELS:
- Mois (${moisActuel}): ${coeffMois}
- Tendance jour (${jourActuel}): ${coeffJour}

RÈGLES DE STOCK:
- Stock sécurité: 10 jours minimum de consommation
- Alerte rupture: < 7 jours de stock
- Alerte critique: < 3 jours de stock
- DLC: Alerte si < 14 jours avant expiration
- Surstock: > 30 jours de stock (immobilisation trésorerie)

CALCUL CONSOMMATION AJUSTÉE:
consommation_ajustee = consommation_moyenne * coeff_mois * coeff_semaine

Analyse les stocks et génère:
1. Alertes priorisées
2. Commandes suggérées
3. Économies potentielles (réduction surstock)

Réponds en JSON.`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyse ces stocks:\n${JSON.stringify(products, null, 2)}\n\nRéponds en JSON.` }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 3000,
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Erreur prédiction stocks:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// 6. 💼 IA ASSISTANT COMMERCIAL - Aide vente terrain
// ═══════════════════════════════════════════════════════════════

export async function getSalesAssistance(context: SalesContext): Promise<SalesAdvice> {
  const systemPrompt = `Tu es un coach commercial expert en vente B2B pour grossistes alimentaires.

CATALOGUE DISTRAM:
${Object.entries(CATALOGUE_DISTRAM).map(([k, v]) => `- ${v.nom}: ${v.prix}€`).join('\n')}

TECHNIQUES DE VENTE SECTEUR:
1. Cross-selling par association (kebab → sauces → boissons)
2. Upselling par volume (remise palettes)
3. Argumentation marge (coût matière vs prix vente)
4. Fidélisation par service (livraison prioritaire, SAV réactif)

OBJECTIONS FRÉQUENTES:
- "Trop cher" → Comparer coût matière et marge générée
- "J'ai déjà un fournisseur" → Différenciation service + test gratuit
- "Pas le moment" → Créer l'urgence (promo limitée, stock limité)
- "Je vais réfléchir" → Identifier le vrai frein

Adapte tes conseils au contexte et génère des opportunités concrètes.

Réponds en JSON.`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Contexte de vente:\n${JSON.stringify(context, null, 2)}\n\nGénère des conseils en JSON.` }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2500,
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Erreur assistant commercial:', error);
    throw error;
  }
}
