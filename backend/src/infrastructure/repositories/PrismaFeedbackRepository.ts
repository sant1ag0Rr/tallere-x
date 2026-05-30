import { feedback } from '@prisma/client';
import { IFeedbackRepository } from '../../domain/repositories/IFeedbackRepository';
import prisma from '../database/prisma';

export class PrismaFeedbackRepository implements IFeedbackRepository {
  async findAll(workOrderId?: string): Promise<feedback[]> {
    return prisma.feedback.findMany({
      where: workOrderId ? { work_order_id: workOrderId } : undefined,
      orderBy: { created_at: 'desc' }
    });
  }

  private sanitizeData(data: any): any {
    const { 
      id, created_at, updated_at, createdAt, updatedAt,
      profiles, profile, work_orders, work_order, client_name,
      client_id, work_order_id,
      ...validData
    } = data;

    const sanitized: any = { ...validData };

    if (client_id) {
      sanitized.profiles = { connect: { id: client_id } };
    }
    if (work_order_id) {
      sanitized.work_orders = { connect: { id: work_order_id } };
    }

    return sanitized;
  }

  async create(data: Omit<feedback, 'id' | 'created_at'>): Promise<feedback> {
    return prisma.feedback.create({ data: this.sanitizeData(data) });
  }
}
