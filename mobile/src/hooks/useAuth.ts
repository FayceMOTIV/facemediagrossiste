import { useState, useEffect, useCallback } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '@/services/firebase';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: string;
  depot?: string;
}

const SESSION_KEY = 'distram_livreur_session';

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const data = userDoc.data();
        const appUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName ?? data?.displayName ?? null,
          role: data?.role ?? 'livreur',
          depot: data?.depot,
        };
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(appUser));
        setUser(appUser);
      } else {
        await AsyncStorage.removeItem(SESSION_KEY);
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
      const data = userDoc.data();
      if (data?.role !== 'livreur' && data?.role !== 'admin' && data?.role !== 'manager') {
        await signOut(auth);
        throw new Error('Accès réservé aux livreurs');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(msg);
      setLoading(false);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  return { user, loading, error, login, logout };
}
