'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  loginWithEmail,
  logout as firebaseLogout,
  onAuthChange,
  resetPassword,
  AppUser,
} from '@/services/firebase/auth';
import { auth } from '@/services/firebase/config';

// Type guard for Firebase Auth errors
interface FirebaseAuthError extends Error {
  code: string;
}
function isFirebaseAuthError(error: unknown): error is FirebaseAuthError {
  return error instanceof Error && 'code' in error;
}

async function createServerSession(idToken: string): Promise<{ role?: string; needsRefresh?: boolean }> {
  const res = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) return {};
  return res.json();
}

async function ensureSession(forceRefresh = false): Promise<string | null> {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  try {
    const idToken = await currentUser.getIdToken(forceRefresh);
    const data = await createServerSession(idToken);

    if (data.needsRefresh) {
      // Custom claims were just set — refresh token to include them
      const freshToken = await currentUser.getIdToken(true);
      await createServerSession(freshToken);
      return data.role ?? null;
    }

    return data.role ?? null;
  } catch {
    return null;
  }
}

interface AuthState {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  const router = useRouter();
  const sessionCreated = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user && !sessionCreated.current) {
        sessionCreated.current = true;
        // Ensure __session cookie is valid (non-blocking)
        ensureSession().catch(() => {});
      } else if (!user) {
        sessionCreated.current = false;
        // User signed out — delete server session
        fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
      }
      setState({ user, loading: false, error: null });
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const user = await loginWithEmail(email, password);

        // Create server-side __session cookie
        sessionCreated.current = true;
        await ensureSession();

        setState({ user, loading: false, error: null });

        // Redirect based on role
        if (user.role === 'livreur') {
          router.push('/livraisons');
        } else if (user.role === 'client') {
          router.push('/commandes');
        } else {
          router.push('/dashboard');
        }

        return user;
      } catch (error: unknown) {
        const message = isFirebaseAuthError(error)
          ? getErrorMessage(error.code)
          : 'Une erreur est survenue';
        setState((prev) => ({ ...prev, loading: false, error: message }));
        throw new Error(message);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      // Delete server session first
      await fetch('/api/auth/logout', { method: 'POST' });
      await firebaseLogout();
      sessionCreated.current = false;
      setState({ user: null, loading: false, error: null });
      router.push('/login');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Erreur lors de la déconnexion';
      setState((prev) => ({ ...prev, loading: false, error: message }));
    }
  }, [router]);

  const sendPasswordReset = useCallback(async (email: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await resetPassword(email);
      setState((prev) => ({ ...prev, loading: false }));
      return true;
    } catch (error: unknown) {
      const message = isFirebaseAuthError(error)
        ? getErrorMessage(error.code)
        : 'Une erreur est survenue';
      setState((prev) => ({ ...prev, loading: false, error: message }));
      throw new Error(message);
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.user,
    isAdmin: state.user?.role === 'admin',
    isManager:
      state.user?.role === 'manager' || state.user?.role === 'admin',
    isCommercial:
      state.user?.role === 'commercial' ||
      state.user?.role === 'manager' ||
      state.user?.role === 'admin',
    isLivreur: state.user?.role === 'livreur',
    login,
    logout,
    sendPasswordReset,
    clearError,
  };
}

// Messages d'erreur en français
function getErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'Adresse email invalide';
    case 'auth/user-disabled':
      return 'Ce compte a été désactivé';
    case 'auth/user-not-found':
      return 'Aucun compte associé à cet email';
    case 'auth/wrong-password':
      return 'Mot de passe incorrect';
    case 'auth/invalid-credential':
      return 'Email ou mot de passe incorrect';
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Réessayez plus tard';
    case 'auth/network-request-failed':
      return 'Erreur réseau. Vérifiez votre connexion';
    default:
      return 'Une erreur est survenue. Réessayez';
  }
}
