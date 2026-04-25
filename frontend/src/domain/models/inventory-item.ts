export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minQuantity: number;
  unitPrice: number;
  supplier: string;
  lastRestockDate: string;
  createdAt: string;
  updatedAt: string;
}
