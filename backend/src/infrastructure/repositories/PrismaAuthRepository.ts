import { AuthUser, UserRole, USER_ROLES } from '../../domain/models/Auth';
import {
  AuthUserWithPassword,
  CreateAuthUserData,
  IAuthRepository
} from '../../domain/repositories/IAuthRepository';
import prisma from '../database/prisma';
import * as crypto from 'crypto';

interface ProfileRecord {
  id: string;
  email: string | null;
  role: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
}

interface UserRecord {
  id: string;
  email: string | null;
  encrypted_password?: string | null;
  profiles?: ProfileRecord | null;
}

const normalizeRole = (role: string | null | undefined): UserRole => {
  if (role && USER_ROLES.includes(role as UserRole)) {
    return role as UserRole;
  }
  return 'client';
};

const toAuthUser = (user: UserRecord): AuthUser => {
  const p = user.profiles;
  return {
    id: user.id,
    email: user.email || p?.email || '',
    role: normalizeRole(p?.role),
    firstName: p?.first_name || '',
    lastName: p?.last_name || '',
    phone: p?.phone || null,
    avatarUrl: p?.avatar_url || null,
    isActive: p?.is_active ?? true,
    createdAt: p?.created_at || new Date(),
    updatedAt: p?.updated_at || new Date()
  };
};

export class PrismaAuthRepository implements IAuthRepository {
  async findByEmail(email: string): Promise<AuthUserWithPassword | null> {
    const user = await prisma.users.findFirst({
      where: { email },
      include: { profiles: true }
    });

    if (!user) {
      return null;
    }

    return {
      user: toAuthUser(user as UserRecord),
      passwordHash: user.encrypted_password || ''
    };
  }

  async findById(id: string): Promise<AuthUser | null> {
    const user = await prisma.users.findUnique({
      where: { id },
      include: { profiles: true }
    });
    return user ? toAuthUser(user as UserRecord) : null;
  }

  async create(data: CreateAuthUserData): Promise<AuthUser> {
    const id = crypto.randomUUID();
    const user = await prisma.users.create({
      data: {
        id,
        email: data.email,
        encrypted_password: data.passwordHash,
        aud: 'authenticated',
        role: 'authenticated',
        profiles: {
          create: {
            email: data.email,
            role: data.role,
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
            avatar_url: data.avatarUrl,
            is_active: true
          }
        }
      },
      include: { profiles: true }
    });

    return toAuthUser(user as UserRecord);
  }
}
