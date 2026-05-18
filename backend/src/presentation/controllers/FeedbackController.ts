import { Request, Response } from 'express';
import { FeedbackUseCases } from '../../application/useCases/FeedbackUseCases';
import { PrismaFeedbackRepository } from '../../infrastructure/repositories/PrismaFeedbackRepository';

export class FeedbackController {
  private useCases: FeedbackUseCases;

  constructor() {
    const repository = new PrismaFeedbackRepository();
    this.useCases = new FeedbackUseCases(repository);
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const workOrderId = typeof req.query.workOrderId === 'string' ? req.query.workOrderId : undefined;
      const data = await this.useCases.getFeedback(workOrderId);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { clientId, workOrderId, rating, comment } = req.body;
      const data = await this.useCases.createFeedback({
        client_id: clientId || null,
        work_order_id: workOrderId || null,
        rating: rating ? Number(rating) : null,
        comment: comment || null
      } as any);

      res.status(201).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
