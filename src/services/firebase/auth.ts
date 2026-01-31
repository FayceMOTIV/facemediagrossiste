import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './config';

export type UserRole = 'admin' | 'commercial' | 'livreur' | 'client';

export interface AppUser extends User {
  role: UserRole;
  depot?: string;
  displayName: string;
  telephone?: string;
  createdAt?: Date;
}

export const loginWithEmail = async (email: string, password: string): Promise<AppUser> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
  return { ...userCredential.user, ...userDoc.data() } as AppUser;
};

export const registerUser = async (
  email: string,
  password: string,
  userData: { displayName: string; role: UserRole; depot?: string; telephone?: string }
): Promise<AppUser> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, 'users', userCredential.user.uid), {
    email,
    displayName: userData.displayName,
    role: userData.role,
    depot: userData.depot || 'lyon',
    telephone: userData.telephone || '',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { ...userCredential.user, ...userData } as AppUser;
};

export const logout = () => signOut(auth);

export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

export const onAuthChange = (callback: (user: AppUser | null) => void) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        callback({ ...user, ...userDoc.data() } as AppUser);
      } else {
        callback(user as AppUser);
      }
    } else {
      callback(null);
    }
  });
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
