import { vehicles } from '@prisma/client';

export interface IVehicleRepository {
  findAll(): Promise<vehicles[]>;
  findById(id: string): Promise<vehicles | null>;
  create(data: Omit<vehicles, 'id' | 'createdAt' | 'updatedAt'>): Promise<vehicles>;
  update(id: string, data: Partial<vehicles>): Promise<vehicles>;
  delete(id: string): Promise<void>;
}
