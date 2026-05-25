import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';
import { appointments } from '@prisma/client';
import { AppointmentFilters, PaginatedResult } from '../dtos/CommonDtos';

export class AppointmentUseCases {
  constructor(private repository: IAppointmentRepository) {}

  async getAppointments(): Promise<appointments[]> {
    return this.repository.findAll();
  }

  async getAppointmentsPaginated(filters: AppointmentFilters): Promise<PaginatedResult<appointments>> {
    return this.repository.findPaginated(filters);
  }

  async getAppointmentById(id: string): Promise<appointments | null> {
    return this.repository.findById(id);
  }

  async getClientAppointments(clientId: string): Promise<appointments[]> {
    return this.repository.findByClientId(clientId);
  }

  async createAppointment(data: Omit<appointments, 'id' | 'created_at' | 'updated_at'>): Promise<appointments> {
    return this.repository.create(data);
  }

  async updateAppointment(id: string, data: Partial<appointments>): Promise<appointments> {
    return this.repository.update(id, data);
  }

  async deleteAppointment(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
