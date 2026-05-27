import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getMe, logoutUser, type MeUser } from '../api';

type AuthUser = MeUser;

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  refreshAuth: () => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const refreshAuth = async () => {
    setIsCheckingAuth(true);
    try {
      const response = await getMe();
      setUser((response?.user as AuthUser) ?? null);
      return true;
    } catch {
      setUser(null);
      return false;
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const bootstrapAuth = async () => {
      try {
        const response = await getMe();
        if (mounted) {
          setUser((response?.user as AuthUser) ?? null);
        }
      } catch {
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    bootstrapAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isCheckingAuth,
      refreshAuth,
      logout,
    }),
    [isCheckingAuth, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}