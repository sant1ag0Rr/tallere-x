import { appointments } from '@prisma/client';
import { AppointmentFilters, PaginatedResult } from '../../application/dtos/CommonDtos';

export interface IAppointmentRepository {
  findAll(): Promise<appointments[]>;
  findPaginated(filters: AppointmentFilters): Promise<PaginatedResult<appointments>>;
  findById(id: string): Promise<appointments | null>;
  findByClientId(clientId: string): Promise<appointments[]>;
  create(data: Omit<appointments, 'id' | 'created_at' | 'updated_at'>): Promise<appointments>;
  update(id: string, data: Partial<appointments>): Promise<appointments>;
  delete(id: string): Promise<void>;
}
