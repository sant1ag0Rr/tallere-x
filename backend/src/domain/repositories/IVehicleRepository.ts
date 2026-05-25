import { vehicles } from '@prisma/client';
import { PaginatedResult, VehicleFilters } from '../../application/dtos/CommonDtos';

export interface IVehicleRepository {
  findAll(): Promise<vehicles[]>;
  findPaginated(filters: VehicleFilters): Promise<PaginatedResult<vehicles>>;
  findById(id: string): Promise<vehicles | null>;
  create(data: Omit<vehicles, 'id' | 'created_at' | 'updated_at'>): Promise<vehicles>;
  update(id: string, data: Partial<vehicles>): Promise<vehicles>;
  delete(id: string): Promise<void>;
}
