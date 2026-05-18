import { appointments } from '@prisma/client';

export interface IAppointmentRepository {
  findAll(): Promise<appointments[]>;
  findById(id: string): Promise<appointments | null>;
  findByClientId(clientId: string): Promise<appointments[]>;
  create(data: Omit<appointments, 'id' | 'createdAt' | 'updatedAt'>): Promise<appointments>;
  update(id: string, data: Partial<appointments>): Promise<appointments>;
  delete(id: string): Promise<void>;
}
