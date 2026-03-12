import 'server-only';
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminApp: App | undefined;

function initAdmin(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase Admin environment variables: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY'
    );
  }

  adminApp = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });

  return adminApp;
}

export const getAdminDb = (): Firestore => {
  initAdmin();
  return getFirestore();
};

export const getAdminAuth = (): Auth => {
  initAdmin();
  return getAuth();
};

export const verifySessionToken = async (
  token: string
): Promise<{
  uid: string;
  role: string;
  depot?: string;
  email?: string;
} | null> => {
  try {
    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(token);
    return {
      uid: decoded.uid,
      role: (decoded['role'] as string) ?? 'client',
      depot: decoded['depot'] as string | undefined,
      email: decoded.email,
    };
  } catch {
    return null;
  }
};

// Verify a Firebase session cookie (for middleware + API route auth)
export const verifySessionCookieData = async (
  sessionCookie: string,
  checkRevoked = false
): Promise<{
  uid: string;
  role: string;
  depot?: string;
  staff?: boolean;
  email?: string;
} | null> => {
  try {
    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, checkRevoked);
    return {
      uid: decoded.uid,
      role: (decoded['role'] as string) ?? 'client',
      depot: decoded['depot'] as string | undefined,
      staff: decoded['staff'] as boolean | undefined,
      email: decoded.email,
    };
  } catch {
    return null;
  }
};

export const setCustomClaims = async (
  uid: string,
  claims: { role: string; depot?: string; staff?: boolean }
): Promise<void> => {
  const adminAuth = getAdminAuth();
  await adminAuth.setCustomUserClaims(uid, claims);
};

export const disableUser = async (uid: string): Promise<void> => {
  const adminAuth = getAdminAuth();
  await adminAuth.updateUser(uid, { disabled: true });
};

export const enableUser = async (uid: string): Promise<void> => {
  const adminAuth = getAdminAuth();
  await adminAuth.updateUser(uid, { disabled: false });
};
