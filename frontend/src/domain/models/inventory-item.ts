export interface InventoryItem {
  id: string;
  name: string;
  code?: string;
  sku: string;
  category: string;
  quantity: number;
  stock?: number;
  minQuantity: number;
  unitPrice: number;
  supplier: string;
  lastRestockDate: string;
  createdAt: string;
  updatedAt: string;
}
