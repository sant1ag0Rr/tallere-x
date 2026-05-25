import { AuthUser, UserRole, USER_ROLES } from '../../domain/models/Auth';
import {
  AuthUserWithPassword,
  CreateAuthUserData,
  IAuthRepository
} from '../../domain/repositories/IAuthRepository';
import prisma from '../database/prisma';

interface AppUserRecord {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean | null;
  created_at: Date | string | null;
  updated_at: Date | string | null;
}

const normalizeRole = (role: string | null | undefined): UserRole => {
  if (role && USER_ROLES.includes(role as UserRole)) {
    return role as UserRole;
  }
  return 'client';
};

const toDate = (value: Date | string | null): Date | null => {
  if (!value) {
    return null;
  }
  return value instanceof Date ? value : new Date(value);
};

const toAuthUser = (user: AppUserRecord): AuthUser => ({
  id: user.id,
  email: user.email,
  role: normalizeRole(user.role),
  firstName: user.first_name,
  lastName: user.last_name,
  phone: user.phone ?? null,
  avatarUrl: user.avatar_url ?? null,
  isActive: user.is_active ?? true,
  createdAt: toDate(user.created_at),
  updatedAt: toDate(user.updated_at)
});

export class PrismaAuthRepository implements IAuthRepository {
  async findByEmail(email: string): Promise<AuthUserWithPassword | null> {
    const user = await prisma.app_users.findUnique({ where: { email } });

    if (!user) {
      return null;
    }

    return {
      user: toAuthUser(user),
      passwordHash: user.password_hash
    };
  }

  async findById(id: string): Promise<AuthUser | null> {
    const user = await prisma.app_users.findUnique({ where: { id } });
    return user ? toAuthUser(user) : null;
  }

  async create(data: CreateAuthUserData): Promise<AuthUser> {
    const user = await prisma.app_users.create({
      data: {
        email: data.email,
        password_hash: data.passwordHash,
        role: data.role,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        avatar_url: data.avatarUrl,
        is_active: true
      }
    });

    return toAuthUser(user);
  }
}
