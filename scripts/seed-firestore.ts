/**
 * Script de seed Firestore — données de démo DISTRAM
 * Usage: npx ts-node -r tsconfig-paths/register scripts/seed-firestore.ts
 * Prérequis: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY dans .env.local
 *            scripts/create-users.ts doit avoir été exécuté avant
 */

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const projectId = process.env.FIREBASE_PROJECT_ID!;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL!;
const privateKey = process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });
}

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

// ─── Données clients ───────────────────────────────────────────────────────

const CLIENTS = [
  {
    id: 'client_001',
    nom: 'Kebab Istanbul',
    email: 'kebab.istanbul@test.fr',
    telephone: '04 78 00 01 01',
    adresse: '15 rue de la République, 69001 Lyon',
    type: 'kebab',
    depot: 'lyon',
    status: 'actif',
    commercial: 'commercial@distram.fr',
    caAnnuel: 42000,
    panierMoyen: 350,
    frequenceCommande: 'hebdomadaire',
    riskScore: 15,
    lastOrderDate: daysAgo(3),
  },
  {
    id: 'client_002',
    nom: 'Tacos Palace',
    email: 'tacos.palace@test.fr',
    telephone: '04 78 00 02 02',
    adresse: '8 cours Gambetta, 69003 Lyon',
    type: 'tacos',
    depot: 'lyon',
    status: 'actif',
    commercial: 'commercial@distram.fr',
    caAnnuel: 28000,
    panierMoyen: 280,
    frequenceCommande: 'bihebdomadaire',
    riskScore: 32,
    lastOrderDate: daysAgo(8),
  },
  {
    id: 'client_003',
    nom: 'Pizza Al Baraka',
    email: 'pizza.albaraka@test.fr',
    telephone: '04 78 00 03 03',
    adresse: '22 rue Garibaldi, 69006 Lyon',
    type: 'pizza',
    depot: 'lyon',
    status: 'actif',
    commercial: 'commercial@distram.fr',
    caAnnuel: 18000,
    panierMoyen: 200,
    frequenceCommande: 'bihebdomadaire',
    riskScore: 55,
    lastOrderDate: daysAgo(15),
  },
  {
    id: 'client_004',
    nom: 'Burger Halal Express',
    email: 'burger.express@test.fr',
    telephone: '04 78 00 04 04',
    adresse: '45 avenue Berthelot, 69008 Lyon',
    type: 'burger',
    depot: 'lyon',
    status: 'actif',
    commercial: 'commercial@distram.fr',
    caAnnuel: 35000,
    panierMoyen: 420,
    frequenceCommande: 'hebdomadaire',
    riskScore: 20,
    lastOrderDate: daysAgo(5),
  },
  {
    id: 'client_005',
    nom: 'Snack El Farouk',
    email: 'snack.elfarouk@test.fr',
    telephone: '04 78 00 05 05',
    adresse: '3 rue Montgolfier, 69002 Lyon',
    type: 'snack',
    depot: 'lyon',
    status: 'actif',
    commercial: 'commercial@distram.fr',
    caAnnuel: 12000,
    panierMoyen: 150,
    frequenceCommande: 'mensuelle',
    riskScore: 72,
    lastOrderDate: daysAgo(22),
  },
];

// ─── Produits du catalogue ──────────────────────────────────────────────────

const PRODUITS_SAMPLE = [
  { ref: 'VIA-001', nom: 'Broche kebab bœuf/veau 10kg', prix: 75, categorie: 'viandes', stock: randomStock(), seuil: 5 },
  { ref: 'VIA-002', nom: 'Broche kebab bœuf/veau 15kg', prix: 105, categorie: 'viandes', stock: randomStock(), seuil: 3 },
  { ref: 'VIA-003', nom: 'Broche kebab poulet 10kg', prix: 68, categorie: 'viandes', stock: randomStock(), seuil: 5 },
  { ref: 'VIA-010', nom: 'Filet de poulet mariné 5kg', prix: 32, categorie: 'viandes', stock: randomStock(), seuil: 10 },
  { ref: 'VIA-011', nom: 'Viande hachée halal 5kg', prix: 28, categorie: 'viandes', stock: 3, seuil: 8 }, // critique
  { ref: 'VIA-020', nom: 'Merguez halal 2kg', prix: 18.5, categorie: 'viandes', stock: randomStock(), seuil: 15 },
  { ref: 'PAI-001', nom: 'Pain pita 16cm x100', prix: 18, categorie: 'pains', stock: randomStock(), seuil: 15 },
  { ref: 'PAI-002', nom: 'Pain pita 20cm x80', prix: 22, categorie: 'pains', stock: randomStock(), seuil: 10 },
  { ref: 'PAI-003', nom: 'Galette durum 30cm x72', prix: 20, categorie: 'pains', stock: randomStock(), seuil: 12 },
  { ref: 'SAU-001', nom: 'Sauce kebab 10L', prix: 25, categorie: 'sauces', stock: 4, seuil: 10 }, // faible
  { ref: 'SAU-002', nom: 'Sauce blanche 10L', prix: 22, categorie: 'sauces', stock: randomStock(), seuil: 8 },
  { ref: 'SAU-003', nom: 'Harissa 10L', prix: 18, categorie: 'sauces', stock: randomStock(), seuil: 8 },
  { ref: 'SAU-004', nom: 'Sauce tacos 10L', prix: 24, categorie: 'sauces', stock: randomStock(), seuil: 6 },
  { ref: 'FROM-001', nom: 'Edam tranches 1kg', prix: 8.5, categorie: 'fromages', stock: randomStock(), seuil: 20 },
  { ref: 'FROM-002', nom: 'Mozzarella râpée 2kg', prix: 11, categorie: 'fromages', stock: randomStock(), seuil: 15 },
  { ref: 'LEG-001', nom: 'Chou blanc', prix: 4, categorie: 'legumes', stock: randomStock(), seuil: 20 },
  { ref: 'LEG-003', nom: 'Tomates 5kg', prix: 8, categorie: 'legumes', stock: randomStock(), seuil: 15 },
  { ref: 'FRI-001', nom: 'Frites classic 10mm 5kg×4', prix: 28, categorie: 'frites', stock: randomStock(), seuil: 10 },
  { ref: 'FRI-002', nom: 'Frites allumettes 7mm 5kg×4', prix: 30, categorie: 'frites', stock: randomStock(), seuil: 8 },
  { ref: 'BOI-002', nom: 'Soda 33cl×24', prix: 12, categorie: 'boissons', stock: randomStock(), seuil: 20 },
];

// ─── Commandes ──────────────────────────────────────────────────────────────

function buildOrders(): Array<Record<string, unknown>> {
  const statuses = ['brouillon', 'validee', 'preparation', 'livraison', 'livree', 'livree', 'livree'];

  return [
    makeOrder('client_001', 'Kebab Istanbul', statuses[6], daysAgo(1), 420, 'lyon'),
    makeOrder('client_001', 'Kebab Istanbul', statuses[4], daysAgo(3), 385, 'lyon'),
    makeOrder('client_002', 'Tacos Palace', statuses[5], daysAgo(2), 310, 'lyon'),
    makeOrder('client_002', 'Tacos Palace', statuses[1], daysAgo(0), 290, 'lyon'),
    makeOrder('client_003', 'Pizza Al Baraka', statuses[3], daysAgo(0), 220, 'lyon'),
    makeOrder('client_003', 'Pizza Al Baraka', statuses[5], daysAgo(15), 195, 'lyon'),
    makeOrder('client_004', 'Burger Halal Express', statuses[6], daysAgo(1), 510, 'lyon'),
    makeOrder('client_004', 'Burger Halal Express', statuses[2], daysAgo(0), 465, 'lyon'),
    makeOrder('client_005', 'Snack El Farouk', statuses[5], daysAgo(22), 165, 'lyon'),
    makeOrder('client_001', 'Kebab Istanbul', statuses[0], daysAgo(0), 350, 'lyon'),
  ];
}

function makeOrder(
  clientId: string,
  clientNom: string,
  status: string,
  date: Date,
  montant: number,
  depot: string
): Record<string, unknown> {
  const ht = Math.round(montant / 1.2 * 100) / 100;
  return {
    clientId,
    clientNom,
    status,
    depot,
    createdAt: admin.firestore.Timestamp.fromDate(date),
    updatedAt: admin.firestore.Timestamp.fromDate(date),
    dateLivraison: admin.firestore.Timestamp.fromDate(new Date(date.getTime() + 86400000)),
    totalHT: ht,
    totalTTC: montant,
    tva: Math.round((montant - ht) * 100) / 100,
    assignedTo: 'commercial@distram.fr',
    lignes: [
      { ref: 'VIA-001', nom: 'Broche kebab bœuf/veau 10kg', quantite: 2, prixHT: 75, totalHT: 150 },
      { ref: 'PAI-001', nom: 'Pain pita 16cm x100', quantite: 3, prixHT: 18, totalHT: 54 },
      { ref: 'SAU-001', nom: 'Sauce kebab 10L', quantite: 1, prixHT: 25, totalHT: 25 },
    ],
    notes: '',
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(10, 0, 0, 0);
  return d;
}

function randomStock(): number {
  return Math.floor(Math.random() * 180) + 20;
}

// ─── Seed functions ──────────────────────────────────────────────────────────

async function seedClients() {
  console.log('\n📦 Clients...');
  for (const client of CLIENTS) {
    const { id, ...data } = client;
    await db.collection('clients').doc(id).set({
      ...data,
      lastOrderDate: admin.firestore.Timestamp.fromDate(data.lastOrderDate as Date),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    console.log(`  ✓ ${client.nom}`);
  }
}

async function seedProducts() {
  console.log('\n📦 Produits (stocks)...');
  for (const prod of PRODUITS_SAMPLE) {
    await db.collection('products').doc(prod.ref).set({
      ...prod,
      urgence: prod.stock < prod.seuil ? 'critique' : prod.stock < prod.seuil * 1.5 ? 'faible' : 'normal',
      actif: true,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    console.log(`  ✓ ${prod.ref} — stock: ${prod.stock}`);
  }
}

async function seedOrders() {
  console.log('\n📦 Commandes...');
  const orders = buildOrders();
  for (const order of orders) {
    const ref = await db.collection('orders').add(order);
    console.log(`  ✓ ${order.clientNom} — ${order.status} — ${order.totalTTC}€`);
  }
}

async function seedEmptyCollections() {
  console.log('\n📦 Collections vides...');
  const collections = ['tournees', 'prospects', 'activity_logs', 'chat_sessions', 'demo_requests'];
  for (const col of collections) {
    // Firestore crée la collection à la première écriture
    // On crée un doc _init_ qu'on supprime ensuite pour initialiser la collection
    const ref = db.collection(col).doc('_init_');
    await ref.set({ initialized: true, createdAt: FieldValue.serverTimestamp() });
    await ref.delete();
    console.log(`  ✓ ${col}`);
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seed Firestore DISTRAM...');

  await seedClients();
  await seedProducts();
  await seedOrders();
  await seedEmptyCollections();

  console.log('\n✅ Seed terminé avec succès!');
  console.log('  5 clients Lyon seedés');
  console.log('  20 produits avec stocks variés');
  console.log('  10 commandes (statuts mélangés)');
  console.log('  Collections vides initialisées');

  process.exit(0);
}

main().catch((err) => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
