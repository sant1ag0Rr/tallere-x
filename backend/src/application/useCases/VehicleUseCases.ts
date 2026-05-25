import { IVehicleRepository } from '../../domain/repositories/IVehicleRepository';
import { vehicles } from '@prisma/client';
import { PaginatedResult, VehicleFilters } from '../dtos/CommonDtos';

export class VehicleUseCases {
  constructor(private repository: IVehicleRepository) {}

  async getVehicles(): Promise<vehicles[]> {
    return this.repository.findAll();
  }

  async getVehiclesPaginated(filters: VehicleFilters): Promise<PaginatedResult<vehicles>> {
    return this.repository.findPaginated(filters);
  }

  async getVehicleById(id: string): Promise<vehicles | null> {
    return this.repository.findById(id);
  }

  async createVehicle(data: Omit<vehicles, 'id' | 'created_at' | 'updated_at'>): Promise<vehicles> {
    return this.repository.create(data);
  }

  async updateVehicle(id: string, data: Partial<vehicles>): Promise<vehicles> {
    return this.repository.update(id, data);
  }

  async deleteVehicle(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
