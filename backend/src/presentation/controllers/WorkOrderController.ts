import { Request, Response } from 'express';
import { WorkOrderUseCases } from '../../application/useCases/WorkOrderUseCases';
import { PrismaWorkOrderRepository } from '../../infrastructure/repositories/PrismaWorkOrderRepository';
import { toSnakeCaseObject } from '../utils/caseTransform';

export class WorkOrderController {
  private useCases: WorkOrderUseCases;

  constructor() {
    const repository = new PrismaWorkOrderRepository();
    this.useCases = new WorkOrderUseCases(repository);
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.useCases.getWorkOrders();
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.useCases.getWorkOrderById(req.params.id as string);
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { vehicleId, title, description, priority, reportedProblem, estimatedCost } = req.body;
      const data = await this.useCases.createWorkOrder({
        vehicle_id: vehicleId,
        title: title || null,
        description: description || null,
        status: 'pending',
        priority: priority || 'normal',
        reported_problem: reportedProblem || null,
        diagnosis: null,
        repairs: null,
        worked_minutes: 0,
        estimated_cost: estimatedCost ? parseFloat(estimatedCost) : null,
        actual_cost: null,
        completed_at: null
      } as any);
      res.status(201).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.useCases.updateWorkOrder(req.params.id as string, toSnakeCaseObject(req.body) as any);
      res.status(200).json(data);
    } catch (error: any) {
      console.error('UPDATE ERROR:', error);
      res.status(500).json({ error: error?.message || 'Internal server error', details: error });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.useCases.deleteWorkOrder(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
