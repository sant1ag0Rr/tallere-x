import type { UserRole } from "@/domain/constants";
import type { User } from "@/domain/models/user";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface ApiAuthUser {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AuthResponse {
  user: ApiAuthUser;
  token: string;
  expiresIn: string;
}

export interface MeResponse {
  user: ApiAuthUser;
}

export const mapApiAuthUserToUser = (user: ApiAuthUser): User => ({
  id: user.id,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt ?? new Date().toISOString(),
  updatedAt: user.updatedAt ?? new Date().toISOString(),
  profile: {
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone ?? undefined,
    avatarUrl: user.avatarUrl ?? undefined
  }
});
