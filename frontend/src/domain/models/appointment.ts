import type { AppointmentStatus } from "@/domain/constants";

export interface Appointment {
  id: string;
  clientId: string;
  vehicleId: string;
  vehiclePlate?: string;
  serviceType: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
