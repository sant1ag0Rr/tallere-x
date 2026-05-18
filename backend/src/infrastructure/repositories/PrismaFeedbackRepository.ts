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

  async create(data: Omit<feedback, 'id' | 'created_at'>): Promise<feedback> {
    return prisma.feedback.create({ data: data as any });
  }
}
