import { IInventoryRepository } from '../../domain/repositories/IInventoryRepository';
import { inventory_items } from '@prisma/client';
import prisma from '../database/prisma';

export class PrismaInventoryRepository implements IInventoryRepository {
  async findAll(): Promise<inventory_items[]> {
    return prisma.inventory_items.findMany();
  }

  async findById(id: string): Promise<inventory_items | null> {
    return prisma.inventory_items.findUnique({ where: { id } });
  }

  async create(data: Omit<inventory_items, 'id' | 'createdAt' | 'updatedAt'>): Promise<inventory_items> {
    return prisma.inventory_items.create({ data: data as any });
  }

  async update(id: string, data: Partial<inventory_items>): Promise<inventory_items> {
    return prisma.inventory_items.update({
      where: { id },
      data: data as any
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.inventory_items.delete({ where: { id } });
  }
}
