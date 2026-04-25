import type { InventoryItem } from "./inventory-item";

export interface UsedPart {
  item: InventoryItem;
  quantity: number;
}

export interface WorkOrder {
  id: string;
  vehicleId: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high";
  reportedProblem?: string;
  diagnosis?: string;
  repairs?: string;
  usedParts?: UsedPart[];
  workedMinutes?: number;
  images?: string[];
  estimatedCost: number;
  actualCost?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
