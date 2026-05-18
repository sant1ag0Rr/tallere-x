import type { InventoryItem } from "./inventory-item";
import type { Vehicle } from "./vehicle";

export interface UsedPart {
  item: InventoryItem;
  quantity: number;
}

export type WorkOrderStatus = "pending" | "in_progress" | "in-progress" | "completed" | "cancelled" | "waiting" | "finished";

export interface WorkOrder {
  id: string;
  vehicleId: string;
  vehicle: Vehicle;
  clientName: string;
  title: string;
  description: string;
  status: WorkOrderStatus;
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
