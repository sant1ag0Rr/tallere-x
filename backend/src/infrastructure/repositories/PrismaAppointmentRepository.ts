import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';
import { appointments, Prisma } from '@prisma/client';
import { AppointmentFilters, PaginatedResult, paginate } from '../../application/dtos/CommonDtos';
import prisma from '../database/prisma';

export class PrismaAppointmentRepository implements IAppointmentRepository {
  async findAll(): Promise<appointments[]> {
    return prisma.appointments.findMany({
      orderBy: { date: 'desc' }
    });
  }

  async findPaginated(filters: AppointmentFilters): Promise<PaginatedResult<appointments>> {
    const where: Prisma.appointmentsWhereInput = {
      ...(filters.clientId ? { client_id: filters.clientId } : {}),
      ...(filters.vehicleId ? { vehicle_id: filters.vehicleId } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...((filters.from || filters.to)
        ? {
            date: {
              ...(filters.from ? { gte: filters.from } : {}),
              ...(filters.to ? { lte: filters.to } : {})
            }
          }
        : {})
    };

    const [data, total] = await prisma.$transaction([
      prisma.appointments.findMany({
        where,
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        orderBy: { date: 'desc' }
      }),
      prisma.appointments.count({ where })
    ]);

    return paginate(data, filters.page, filters.limit, total);
  }

  async findById(id: string): Promise<appointments | null> {
    return prisma.appointments.findUnique({ where: { id } });
  }

  async findByClientId(clientId: string): Promise<appointments[]> {
    return prisma.appointments.findMany({ where: { client_id: clientId } });
  }

  async create(data: Omit<appointments, 'id' | 'created_at' | 'updated_at'>): Promise<appointments> {
    return prisma.appointments.create({ data });
  }

  async update(id: string, data: Partial<appointments>): Promise<appointments> {
    return prisma.appointments.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.appointments.delete({ where: { id } });
  }
}
