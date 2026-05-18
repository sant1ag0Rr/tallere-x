import { inventory_items } from '@prisma/client';

export interface IInventoryRepository {
  findAll(): Promise<inventory_items[]>;
  findById(id: string): Promise<inventory_items | null>;
  create(data: Omit<inventory_items, 'id' | 'createdAt' | 'updatedAt'>): Promise<inventory_items>;
  update(id: string, data: Partial<inventory_items>): Promise<inventory_items>;
  delete(id: string): Promise<void>;
}
