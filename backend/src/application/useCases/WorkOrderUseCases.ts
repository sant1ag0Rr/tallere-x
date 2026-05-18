import { IWorkOrderRepository } from '../../domain/repositories/IWorkOrderRepository';
import { work_orders } from '@prisma/client';

export class WorkOrderUseCases {
  constructor(private repository: IWorkOrderRepository) {}

  async getWorkOrders(): Promise<work_orders[]> {
    return this.repository.findAll();
  }

  async getWorkOrderById(id: string): Promise<work_orders | null> {
    return this.repository.findById(id);
  }

  async createWorkOrder(data: Omit<work_orders, 'id' | 'createdAt' | 'updatedAt'>): Promise<work_orders> {
    return this.repository.create(data);
  }

  async updateWorkOrder(id: string, data: Partial<work_orders>): Promise<work_orders> {
    return this.repository.update(id, data);
  }

  async deleteWorkOrder(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
