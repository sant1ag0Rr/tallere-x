"use client";

import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@/domain/models";
import type { UserRole } from "@/domain/constants";

interface LoginCredentials {
  email: string;
  role: UserRole;
}

interface AuthContextValue {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AUTH_STORAGE_KEY = "tallerx-auth-user";

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const CLIENT_ID_BY_EMAIL: Record<string, string> = {
  "client@tallerx.com": "cli-100"
};

const buildMockUser = (credentials: LoginCredentials): User => {
  const now = new Date().toISOString();
  const normalizedEmail = credentials.email.trim().toLowerCase();
  const userId =
    credentials.role === "client"
      ? CLIENT_ID_BY_EMAIL[normalizedEmail] ?? "cli-100"
      : crypto.randomUUID();

  return {
    id: userId,
    email: normalizedEmail,
    role: credentials.role,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    profile: {
      firstName: credentials.role.toUpperCase(),
      lastName: "User"
    }
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const rawUser = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (rawUser) {
        setUser(JSON.parse(rawUser) as User);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const mockUser = buildMockUser(credentials);
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = () => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: user?.role ?? null,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      logout
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
