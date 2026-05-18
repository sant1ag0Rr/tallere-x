import { feedback } from '@prisma/client';

export interface IFeedbackRepository {
  findAll(workOrderId?: string): Promise<feedback[]>;
  create(data: Omit<feedback, 'id' | 'created_at'>): Promise<feedback>;
}
