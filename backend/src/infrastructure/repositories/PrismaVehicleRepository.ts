import { IVehicleRepository } from '../../domain/repositories/IVehicleRepository';
import { Prisma, vehicles } from '@prisma/client';
import { paginate, PaginatedResult, VehicleFilters } from '../../application/dtos/CommonDtos';
import prisma from '../database/prisma';

export class PrismaVehicleRepository implements IVehicleRepository {
  async findAll(): Promise<vehicles[]> {
    return prisma.vehicles.findMany();
  }

  async findPaginated(filters: VehicleFilters): Promise<PaginatedResult<vehicles>> {
    const where: Prisma.vehiclesWhereInput = {
      ...(filters.clientId ? { assigned_client_id: filters.clientId } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.plate ? { plate: { contains: filters.plate, mode: 'insensitive' } } : {}),
      ...(filters.search
        ? {
            OR: [
              { plate: { contains: filters.search, mode: 'insensitive' } },
              { brand: { contains: filters.search, mode: 'insensitive' } },
              { model: { contains: filters.search, mode: 'insensitive' } }
            ]
          }
        : {})
    };

    const [data, total] = await prisma.$transaction([
      prisma.vehicles.findMany({
        where,
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        orderBy: { created_at: 'desc' }
      }),
      prisma.vehicles.count({ where })
    ]);

    return paginate(data, filters.page, filters.limit, total);
  }

  async findById(id: string): Promise<vehicles | null> {
    return prisma.vehicles.findUnique({ where: { id } });
  }

  async create(data: Omit<vehicles, 'id' | 'created_at' | 'updated_at'>): Promise<vehicles> {
    return prisma.vehicles.create({ data });
  }

  async update(id: string, data: Partial<vehicles>): Promise<vehicles> {
    return prisma.vehicles.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.vehicles.delete({ where: { id } });
  }
}
