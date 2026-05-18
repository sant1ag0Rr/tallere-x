import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/models/User';
import prisma from '../database/prisma';

export class PrismaUserRepository implements IUserRepository {
  async findAll(): Promise<any[]> {
    return prisma.profiles.findMany();
  }

  async findById(id: string): Promise<any | null> {
    return prisma.profiles.findUnique({ where: { id } });
  }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    return prisma.profiles.create({ data: data as any });
  }

  async update(id: string, data: Partial<User>): Promise<any> {
    return prisma.profiles.update({ where: { id }, data: data as any });
  }

  async delete(id: string): Promise<void> {
    await prisma.profiles.delete({ where: { id } });
  }
}
