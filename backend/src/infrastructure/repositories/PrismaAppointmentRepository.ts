import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';
import { appointments } from '@prisma/client';
import prisma from '../database/prisma';

export class PrismaAppointmentRepository implements IAppointmentRepository {
  async findAll(): Promise<appointments[]> {
    return prisma.appointments.findMany({
      orderBy: { date: 'desc' }
    });
  }

  async findById(id: string): Promise<appointments | null> {
    return prisma.appointments.findUnique({ where: { id } });
  }

  async findByClientId(clientId: string): Promise<appointments[]> {
    return prisma.appointments.findMany({ where: { client_id: clientId } });
  }

  async create(data: Omit<appointments, 'id' | 'createdAt' | 'updatedAt'>): Promise<appointments> {
    return prisma.appointments.create({ data: data as any });
  }

  async update(id: string, data: Partial<appointments>): Promise<appointments> {
    return prisma.appointments.update({
      where: { id },
      data: data as any
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.appointments.delete({ where: { id } });
  }
}
