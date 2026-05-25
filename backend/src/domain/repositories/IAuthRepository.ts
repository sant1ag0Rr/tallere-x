import { AuthUser, UserRole } from '../models/Auth';

export interface CreateAuthUserData {
  email: string;
  passwordHash: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatarUrl: string | null;
}

export interface AuthUserWithPassword {
  user: AuthUser;
  passwordHash: string | null;
}

export interface IAuthRepository {
  findByEmail(email: string): Promise<AuthUserWithPassword | null>;
  findById(id: string): Promise<AuthUser | null>;
  create(data: CreateAuthUserData): Promise<AuthUser>;
}
