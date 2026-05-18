import { work_orders } from '@prisma/client';

export interface IWorkOrderRepository {
  findAll(): Promise<work_orders[]>;
  findById(id: string): Promise<work_orders | null>;
  create(data: Omit<work_orders, 'id' | 'createdAt' | 'updatedAt'>): Promise<work_orders>;
  update(id: string, data: Partial<work_orders>): Promise<work_orders>;
  delete(id: string): Promise<void>;
}
