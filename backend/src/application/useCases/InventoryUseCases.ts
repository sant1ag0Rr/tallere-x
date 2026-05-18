import { IInventoryRepository } from '../../domain/repositories/IInventoryRepository';
import { inventory_items } from '@prisma/client';

export class InventoryUseCases {
  constructor(private repository: IInventoryRepository) {}

  async getInventoryItems(): Promise<inventory_items[]> {
    return this.repository.findAll();
  }

  async getInventoryItemById(id: string): Promise<inventory_items | null> {
    return this.repository.findById(id);
  }

  async createInventoryItem(data: Omit<inventory_items, 'id' | 'createdAt' | 'updatedAt'>): Promise<inventory_items> {
    return this.repository.create(data);
  }

  async updateInventoryItem(id: string, data: Partial<inventory_items>): Promise<inventory_items> {
    return this.repository.update(id, data);
  }

  async deleteInventoryItem(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
