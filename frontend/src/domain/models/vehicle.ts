import type { VehicleStatus } from "@/domain/constants/vehicle-status";

export interface VehicleMaintenanceRecord {
  id: string;
  description: string;
  mileage: number;
  completedAt: string;
}

export interface Vehicle {
  id: string;
  vin: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  status: VehicleStatus;
  clientId?: string;
  assignedClientId?: string;
  maintenanceHistory: VehicleMaintenanceRecord[];
  createdAt: string;
  updatedAt: string;
}
