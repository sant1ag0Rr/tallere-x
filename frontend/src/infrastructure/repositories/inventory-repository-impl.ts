import type { InventoryItem } from "@/domain/models";
import { httpClient } from "../http/httpClient";

export const inventoryRepository = {
  async listInventory(category?: string): Promise<InventoryItem[]> {
    const inventory = await httpClient.get<InventoryItem[]>('/inventory');
    if (!category) {
      return inventory;
    }
    return inventory.filter((item) => item.category === category);
  },

  async getLowStockItems(): Promise<InventoryItem[]> {
    const inventory = await httpClient.get<InventoryItem[]>('/inventory');
    return inventory.filter((item) => item.quantity <= item.minQuantity);
  },

  async getInventoryStats() {
    const inventory = await httpClient.get<InventoryItem[]>('/inventory');
    return {
      totalItems: inventory.length,
      totalValue: inventory.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
      lowStockItems: inventory.filter((item) => item.quantity <= item.minQuantity).length,
      categories: Array.from(new Set(inventory.map((item) => item.category)))
    };
  },

  async createInventoryItem(data: Partial<InventoryItem>): Promise<InventoryItem> {
    return httpClient.post<InventoryItem>('/inventory', data);
  },

  async deductStock(itemId: string, quantity: number): Promise<void> {
    // We would need a dedicated endpoint like PUT /inventory/:id/deduct or just an update
    // Fetch the item first to get current stock, then update
    const item = await httpClient.get<InventoryItem>(`/inventory/${itemId}`);
    if (item.quantity < quantity) {
      throw new Error('Not enough stock available');
    }
    await httpClient.put(`/inventory/${itemId}`, { quantity: item.quantity - quantity });
  }
};
