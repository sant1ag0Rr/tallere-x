import { feedback } from '@prisma/client';
import { IFeedbackRepository } from '../../domain/repositories/IFeedbackRepository';

export class FeedbackUseCases {
  constructor(private repository: IFeedbackRepository) {}

  async getFeedback(workOrderId?: string): Promise<feedback[]> {
    return this.repository.findAll(workOrderId);
  }

  async createFeedback(data: Omit<feedback, 'id' | 'created_at'>): Promise<feedback> {
    return this.repository.create(data);
  }
}
