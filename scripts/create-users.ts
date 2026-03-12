/**
 * Script de création des comptes utilisateurs DISTRAM
 * Usage: npx tsx scripts/create-users.ts
 * Prérequis: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY dans .env.local
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

const auth = admin.auth();
const db = admin.firestore();

interface UserDef {
  email: string;
  password: string;
  displayName: string;
  role: string;
  depot: string;
  staff: boolean;
  clientId?: string;
}

const USERS: UserDef[] = [
  {
    email: 'admin@distram.fr',
    password: 'Distram2026!',
    displayName: 'Admin DISTRAM',
    role: 'admin',
    depot: 'all',
    staff: true,
  },
  {
    email: 'manager@distram.fr',
    password: 'Demo2026!',
    displayName: 'Manager DISTRAM',
    role: 'manager',
    depot: 'all',
    staff: true,
  },
  {
    email: 'commercial@distram.fr',
    password: 'Demo2026!',
    displayName: 'Commercial Lyon',
    role: 'commercial',
    depot: 'lyon',
    staff: true,
  },
  {
    email: 'livreur@distram.fr',
    password: 'Demo2026!',
    displayName: 'Livreur Lyon',
    role: 'livreur',
    depot: 'lyon',
    staff: true,
  },
  {
    email: 'kebab.istanbul@test.fr',
    password: 'Demo2026!',
    displayName: 'Kebab Istanbul',
    role: 'client',
    depot: 'lyon',
    staff: false,
    clientId: 'client_001',
  },
];

async function createOrUpdateUser(user: UserDef) {
  let uid: string;

  try {
    // Try to get existing user
    const existing = await auth.getUserByEmail(user.email);
    uid = existing.uid;
    console.log(`  ↻ Utilisateur existant: ${user.email} (${uid})`);

    // Update password
    await auth.updateUser(uid, { password: user.password, displayName: user.displayName });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'auth/user-not-found') {
      // Create new user
      const created = await auth.createUser({
        email: user.email,
        password: user.password,
        displayName: user.displayName,
        emailVerified: true,
      });
      uid = created.uid;
      console.log(`  ✓ Créé: ${user.email} (${uid})`);
    } else {
      throw err;
    }
  }

  // Set custom claims
  const claims: Record<string, unknown> = {
    role: user.role,
    depot: user.depot,
    staff: user.staff,
  };
  if (user.clientId) claims.clientId = user.clientId;

  await auth.setCustomUserClaims(uid, claims);
  console.log(`  ✓ Claims: ${JSON.stringify(claims)}`);

  // Create/update Firestore user doc
  const userData: Record<string, unknown> = {
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    depot: user.depot,
    staff: user.staff,
    telephone: '',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  if (user.clientId) userData.clientId = user.clientId;

  await db.collection('users').doc(uid).set(userData, { merge: true });
  console.log(`  ✓ Firestore users/${uid} mis à jour`);

  return uid;
}

async function main() {
  console.log('🚀 Création des comptes DISTRAM...\n');

  for (const user of USERS) {
    console.log(`\n📧 ${user.email} (${user.role})`);
    try {
      await createOrUpdateUser(user);
    } catch (err) {
      console.error(`  ✗ Erreur: ${err}`);
    }
  }

  console.log('\n✅ Terminé. Résumé des comptes:');
  console.log('  admin@distram.fr       / Distram2026! → admin');
  console.log('  manager@distram.fr     / Demo2026!    → manager');
  console.log('  commercial@distram.fr  / Demo2026!    → commercial');
  console.log('  livreur@distram.fr     / Demo2026!    → livreur');
  console.log('  kebab.istanbul@test.fr / Demo2026!    → client');

  process.exit(0);
}

main().catch((err) => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
