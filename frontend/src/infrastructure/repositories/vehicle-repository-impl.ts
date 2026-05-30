import type { Vehicle } from "@/domain/models";
import type { VehicleStatus } from "@/domain/constants";
import { httpClient } from "../http/httpClient";

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const vehicleRepository = {
  async listVehicles(status?: VehicleStatus): Promise<Vehicle[]> {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    const response = await httpClient.get<PaginatedResponse<Vehicle>>(`/vehicles${query}`);
    return response.data;
  },

  async getLatestVehicles(limit = 5): Promise<Vehicle[]> {
    const response = await httpClient.get<PaginatedResponse<Vehicle>>(`/vehicles?limit=${limit}`);
    return response.data;
  },

  async getVehiclesByClientId(clientId: string): Promise<Vehicle[]> {
    const response = await httpClient.get<PaginatedResponse<Vehicle>>(`/vehicles?clientId=${clientId}&limit=100`);
    return response.data;
  },

  async createVehicle(data: Partial<Vehicle>): Promise<Vehicle> {
    const response = await httpClient.post<{ success: boolean; data: Vehicle }>('/vehicles', data);
    return response.data;
  }
};
