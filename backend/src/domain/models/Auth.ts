export const USER_ROLES = ['admin', 'client', 'mechanic', 'seller'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface JwtUserPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface AuthResult {
  user: AuthUser;
  token: string;
  expiresIn: string;
}
