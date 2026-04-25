import { inventoryRepository } from '@/infrastructure/repositories/inventory-repository-impl';
import type { InventoryItem } from '@/domain/models';

export const getInventoryUseCase = async (): Promise<InventoryItem[]> => {
  return await inventoryRepository.listInventory();
};
