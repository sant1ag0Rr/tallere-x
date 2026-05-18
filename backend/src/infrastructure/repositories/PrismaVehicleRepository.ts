import { IVehicleRepository } from '../../domain/repositories/IVehicleRepository';
import { vehicles } from '@prisma/client';
import prisma from '../database/prisma';

export class PrismaVehicleRepository implements IVehicleRepository {
  async findAll(): Promise<vehicles[]> {
    return prisma.vehicles.findMany();
  }

  async findById(id: string): Promise<vehicles | null> {
    return prisma.vehicles.findUnique({ where: { id } });
  }

  async create(data: Omit<vehicles, 'id' | 'createdAt' | 'updatedAt'>): Promise<vehicles> {
    return prisma.vehicles.create({ data: data as any });
  }

  async update(id: string, data: Partial<vehicles>): Promise<vehicles> {
    return prisma.vehicles.update({
      where: { id },
      data: data as any
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.vehicles.delete({ where: { id } });
  }
}
