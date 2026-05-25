"use client";

import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { LoginCredentials, RegisterCredentials, User } from "@/domain/models";
import type { UserRole } from "@/domain/constants";
import { authRepository } from "@/infrastructure/repositories/auth-repository-impl";
import { AUTH_TOKEN_STORAGE_KEY, AUTH_USER_STORAGE_KEY } from "@/infrastructure/http/httpClient";

interface AuthContextValue {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
      const rawUser = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);

      if (rawUser) {
        setUser(JSON.parse(rawUser) as User);
      }

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await authRepository.me();
        window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(currentUser));
        setUser(currentUser);
      } catch {
        window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
        window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    const handleLogout = () => setUser(null);
    window.addEventListener("tallerx-auth-logout", handleLogout);
    void restoreSession();

    return () => window.removeEventListener("tallerx-auth-logout", handleLogout);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const result = await authRepository.login(credentials);
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, result.token);
    window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(result.user));
    setUser(result.user);
    return result.user;
  };

  const register = async (credentials: RegisterCredentials) => {
    const result = await authRepository.register(credentials);
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, result.token);
    window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(result.user));
    setUser(result.user);
    return result.user;
  };

  const logout = () => {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: user?.role ?? null,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
