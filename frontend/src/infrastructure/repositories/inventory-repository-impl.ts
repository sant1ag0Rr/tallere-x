import type { InventoryItem } from "@/domain/models";
import { delay } from "@/infrastructure/utils/delay";

const NOW = new Date();

const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: "inv-001",
    name: "Pastillas de freno delanteras",
    sku: "PAD-FRONT-001",
    category: "Frenos",
    quantity: 15,
    minQuantity: 5,
    unitPrice: 45000,
    supplier: "Automotive Parts Co.",
    lastRestockDate: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString()
  },
  {
    id: "inv-002",
    name: "Filtro de aceite",
    sku: "OIL-FILTER-001",
    category: "Filtros",
    quantity: 3,
    minQuantity: 10,
    unitPrice: 15000,
    supplier: "Engine Supplies Ltd.",
    lastRestockDate: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    updatedAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 20).toISOString()
  },
  {
    id: "inv-003",
    name: "Baterías 12V",
    sku: "BATT-12V-001",
    category: "Electricidad",
    quantity: 8,
    minQuantity: 3,
    unitPrice: 180000,
    supplier: "Power Systems Inc.",
    lastRestockDate: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    updatedAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 10).toISOString()
  },
  {
    id: "inv-004",
    name: "Correa de distribución",
    sku: "BELT-DIST-001",
    category: "Motor",
    quantity: 2,
    minQuantity: 2,
    unitPrice: 120000,
    supplier: "Motor Parts Global",
    lastRestockDate: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    updatedAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    id: "inv-005",
    name: "Aceite sintético 5W-30",
    sku: "OIL-SYNTH-5W30",
    category: "Lubricantes",
    quantity: 22,
    minQuantity: 10,
    unitPrice: 35000,
    supplier: "Lubricant Pro",
    lastRestockDate: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 120).toISOString(),
    updatedAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString()
  }
];

export const inventoryRepository = {
  async listInventory(category?: string): Promise<InventoryItem[]> {
    await delay(800);
    if (!category) {
      return [...MOCK_INVENTORY];
    }
    return MOCK_INVENTORY.filter((item) => item.category === category);
  },

  async getLowStockItems(): Promise<InventoryItem[]> {
    await delay(800);
    return MOCK_INVENTORY.filter((item) => item.quantity <= item.minQuantity);
  },

  async getInventoryStats() {
    await delay(800);
    return {
      totalItems: MOCK_INVENTORY.length,
      totalValue: MOCK_INVENTORY.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
      lowStockItems: MOCK_INVENTORY.filter((item) => item.quantity <= item.minQuantity).length,
      categories: Array.from(new Set(MOCK_INVENTORY.map((item) => item.category)))
    };
  },

  async createInventoryItem(data: Partial<InventoryItem>): Promise<InventoryItem> {
    await delay(500);
    const newItem: InventoryItem = {
      id: `inv-${Math.random().toString(36).substr(2, 9)}`,
      name: data.name || "",
      sku: data.sku || "",
      category: data.category || "",
      quantity: data.quantity || 0,
      minQuantity: data.minQuantity || 0,
      unitPrice: data.unitPrice || 0,
      supplier: data.supplier || "",
      lastRestockDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    MOCK_INVENTORY.unshift(newItem);
    return newItem;
  },

  async deductStock(itemId: string, quantity: number): Promise<void> {
    await delay(300);
    const itemIndex = MOCK_INVENTORY.findIndex((i) => i.id === itemId);
    if (itemIndex > -1) {
      if (MOCK_INVENTORY[itemIndex].quantity < quantity) {
        throw new Error('Not enough stock available');
      }
      MOCK_INVENTORY[itemIndex].quantity -= quantity;
    } else {
      throw new Error('Item not found');
    }
  }
};
