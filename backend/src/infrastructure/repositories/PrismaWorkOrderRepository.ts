import { IWorkOrderRepository } from '../../domain/repositories/IWorkOrderRepository';
import { work_orders } from '@prisma/client';
import prisma from '../database/prisma';

export class PrismaWorkOrderRepository implements IWorkOrderRepository {
  async findAll(): Promise<work_orders[]> {
    return prisma.work_orders.findMany({
      include: {
        vehicles: {
          include: {
            profiles: true
          }
        },
        work_order_parts: {
          include: {
            inventory_items: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    }) as any;
  }

  async findById(id: string): Promise<work_orders | null> {
    return prisma.work_orders.findUnique({
      where: { id },
      include: {
        vehicles: {
          include: {
            profiles: true
          }
        },
        work_order_parts: {
          include: {
            inventory_items: true
          }
        }
      }
    }) as any;
  }

  async create(data: Omit<work_orders, 'id' | 'createdAt' | 'updatedAt'>): Promise<work_orders> {
    return prisma.work_orders.create({ data: data as any });
  }

  async update(id: string, data: Partial<work_orders>): Promise<work_orders> {
    return prisma.work_orders.update({
      where: { id },
      data: data as any
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.work_orders.delete({ where: { id } });
  }
}
