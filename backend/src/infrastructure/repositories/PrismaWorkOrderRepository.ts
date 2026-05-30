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

  private sanitizeData(data: any): any {
    const { 
      id, created_at, updated_at, createdAt, updatedAt, 
      vehicle, vehicles, profile, profiles, client_name, 
      used_parts, images, feedback, work_order_parts,
      vehicle_id,
      ...validData 
    } = data;

    const sanitized: any = { ...validData };

    if (vehicle_id) {
      sanitized.vehicles = { connect: { id: vehicle_id } };
    }

    return sanitized;
  }

  async create(data: Omit<work_orders, 'id' | 'createdAt' | 'updatedAt'>): Promise<work_orders> {
    return prisma.work_orders.create({ data: this.sanitizeData(data) });
  }

  async update(id: string, data: Partial<work_orders>): Promise<work_orders> {
    return prisma.work_orders.update({
      where: { id },
      data: this.sanitizeData(data)
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.work_orders.delete({ where: { id } });
  }
}
