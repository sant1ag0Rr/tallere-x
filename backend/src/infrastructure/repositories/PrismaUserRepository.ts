import { randomUUID } from 'crypto';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/models/User';
import { paginate, PaginatedResult, UserFilters } from '../../application/dtos/CommonDtos';
import prisma from '../database/prisma';

type ProfileRecord = Awaited<ReturnType<typeof prisma.profiles.findMany>>[number];

const toUser = (profile: ProfileRecord): User => ({
  id: profile.id,
  email: profile.email ?? '',
  role: profile.role ?? 'client',
  isActive: profile.is_active ?? true,
  firstName: profile.first_name ?? '',
  lastName: profile.last_name ?? '',
  phone: profile.phone ?? null,
  avatarUrl: profile.avatar_url ?? null,
  createdAt: profile.created_at ?? new Date(0),
  updatedAt: profile.updated_at ?? new Date(0)
});

export class PrismaUserRepository implements IUserRepository {
  async findAll(): Promise<User[]> {
    const profiles = await prisma.profiles.findMany();
    return profiles.map(toUser);
  }

  async findPaginated(filters: UserFilters): Promise<PaginatedResult<User>> {
    const where = {
      ...(filters.search
        ? {
            OR: [
              { email: { contains: filters.search, mode: 'insensitive' as const } },
              { first_name: { contains: filters.search, mode: 'insensitive' as const } },
              { last_name: { contains: filters.search, mode: 'insensitive' as const } }
            ]
          }
        : {}),
      ...(filters.role ? { role: filters.role } : {})
    };

    const [data, total] = await prisma.$transaction([
      prisma.profiles.findMany({
        where,
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        orderBy: { created_at: 'desc' }
      }),
      prisma.profiles.count({ where })
    ]);

    return paginate(data.map(toUser), filters.page, filters.limit, total);
  }

  async findById(id: string): Promise<User | null> {
    const profile = await prisma.profiles.findUnique({ where: { id } });
    return profile ? toUser(profile) : null;
  }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const profile = await prisma.profiles.create({
      data: {
        id: randomUUID(),
        email: data.email,
        role: data.role,
        is_active: data.isActive,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        avatar_url: data.avatarUrl
      }
    });
    return toUser(profile);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const profile = await prisma.profiles.update({
      where: { id },
      data: {
        email: data.email,
        role: data.role,
        is_active: data.isActive,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        avatar_url: data.avatarUrl
      }
    });
    return toUser(profile);
  }

  async delete(id: string): Promise<void> {
    await prisma.profiles.delete({ where: { id } });
  }
}
