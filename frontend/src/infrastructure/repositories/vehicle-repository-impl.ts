import type { Vehicle } from "@/domain/models";
import type { VehicleStatus } from "@/domain/constants";
import { httpClient } from "../http/httpClient";

export const vehicleRepository = {
  async listVehicles(status?: VehicleStatus): Promise<Vehicle[]> {
    const vehicles = await httpClient.get<Vehicle[]>('/vehicles');
    if (!status) {
      return vehicles;
    }
    return vehicles.filter((vehicle) => vehicle.status === status);
  },

  async getLatestVehicles(limit = 5): Promise<Vehicle[]> {
    const vehicles = await httpClient.get<Vehicle[]>('/vehicles');
    return vehicles
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  async getVehiclesByClientId(clientId: string): Promise<Vehicle[]> {
    const vehicles = await httpClient.get<Vehicle[]>('/vehicles');
    return vehicles.filter((vehicle) => vehicle.assignedClientId === clientId);
  },

  async createVehicle(data: Partial<Vehicle>): Promise<Vehicle> {
    return httpClient.post<Vehicle>('/vehicles', data);
  }
};
