import { USER_ROLES, UserRole } from '../../domain/models/Auth';
import { AppError } from '../errors/AppError';

export interface RegisterDto {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string | null;
  avatarUrl?: string | null;
}

export interface LoginDto {
  email: string;
  password: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const readString = (body: Record<string, unknown>, key: string): string | undefined => {
  const value = body[key];
  return typeof value === 'string' ? value.trim() : undefined;
};

const parseRole = (value: unknown): UserRole => {
  if (typeof value === 'string' && USER_ROLES.includes(value as UserRole)) {
    return value as UserRole;
  }
  throw new AppError(400, 'Role must be one of: admin, client, mechanic, seller');
};

export const parseRegisterDto = (body: unknown): RegisterDto => {
  if (!isRecord(body)) {
    throw new AppError(400, 'Request body must be a JSON object');
  }

  const email = readString(body, 'email')?.toLowerCase();
  const password = readString(body, 'password');
  const firstName = readString(body, 'firstName');
  const lastName = readString(body, 'lastName');

  if (!email || !EMAIL_REGEX.test(email)) {
    throw new AppError(400, 'A valid email is required');
  }

  if (!password || password.length < 8) {
    throw new AppError(400, 'Password must have at least 8 characters');
  }

  if (!firstName || !lastName) {
    throw new AppError(400, 'firstName and lastName are required');
  }

  return {
    email,
    password,
    role: parseRole(body.role),
    firstName,
    lastName,
    phone: readString(body, 'phone') ?? null,
    avatarUrl: readString(body, 'avatarUrl') ?? null
  };
};

export const parseLoginDto = (body: unknown): LoginDto => {
  if (!isRecord(body)) {
    throw new AppError(400, 'Request body must be a JSON object');
  }

  const email = readString(body, 'email')?.toLowerCase();
  const password = readString(body, 'password');

  if (!email || !EMAIL_REGEX.test(email) || !password) {
    throw new AppError(400, 'Email and password are required');
  }

  return { email, password };
};
