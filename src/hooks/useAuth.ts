'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  loginWithEmail,
  logout as firebaseLogout,
  onAuthChange,
  resetPassword,
  AppUser
} from '@/services/firebase/auth';

// Type guard for Firebase Auth errors
interface FirebaseAuthError extends Error {
  code: string;
}
function isFirebaseAuthError(error: unknown): error is FirebaseAuthError {
  return error instanceof Error && 'code' in error;
}

// Gestion du cookie de session pour le middleware
function setSessionCookie(user: AppUser) {
  const payload = btoa(JSON.stringify({ uid: user.uid, role: user.role, depot: user.depot }));
  document.cookie = `fastgross_session=${payload}; path=/; SameSite=Strict; max-age=86400`;
}

function clearSessionCookie() {
  document.cookie = 'fastgross_session=; path=/; max-age=0';
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

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        setSessionCookie(user);
      } else {
        clearSessionCookie();
      }
      setState({ user, loading: false, error: null });
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const user = await loginWithEmail(email, password);
      setSessionCookie(user);
      setState({ user, loading: false, error: null });

      // Redirection selon le rôle
      if (user.role === 'livreur') {
        router.push('/livraisons');
      } else if (user.role === 'client') {
        router.push('/commandes');
      } else {
        router.push('/dashboard');
      }

      return user;
    } catch (error: unknown) {
      const message = isFirebaseAuthError(error) ? getErrorMessage(error.code) : 'Une erreur est survenue';
      setState(prev => ({ ...prev, loading: false, error: message }));
      throw new Error(message);
    }
  }, [router]);

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      await firebaseLogout();
      clearSessionCookie();
      setState({ user: null, loading: false, error: null });
      router.push('/login');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la déconnexion';
      setState(prev => ({ ...prev, loading: false, error: message }));
    }
  }, [router]);

  const sendPasswordReset = useCallback(async (email: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await resetPassword(email);
      setState(prev => ({ ...prev, loading: false }));
      return true;
    } catch (error: unknown) {
      const message = isFirebaseAuthError(error) ? getErrorMessage(error.code) : 'Une erreur est survenue';
      setState(prev => ({ ...prev, loading: false, error: message }));
      throw new Error(message);
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.user,
    isAdmin: state.user?.role === 'admin',
    isManager: state.user?.role === 'manager' || state.user?.role === 'admin',
    isCommercial: state.user?.role === 'commercial' || state.user?.role === 'manager' || state.user?.role === 'admin',
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
