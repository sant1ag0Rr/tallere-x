import type { Appointment } from "@/domain/models";
import type { AppointmentStatus } from "@/domain/constants";
import { httpClient } from "../http/httpClient";

interface PaginatedResponse<T> {
  data: T[];
}

export const appointmentRepository = {
  async listAppointments(status?: AppointmentStatus): Promise<Appointment[]> {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    const response = await httpClient.get<PaginatedResponse<Appointment>>(`/appointments${query}`);
    return response.data;
  },

  async getAppointmentsToday(): Promise<Appointment[]> {
    const today = new Date().toISOString().slice(0, 10);
    const response = await httpClient.get<PaginatedResponse<Appointment>>(`/appointments?from=${today}&to=${today}`);
    return response.data;
  },

  async getAppointmentsByClientId(clientId: string): Promise<Appointment[]> {
    const response = await httpClient.get<PaginatedResponse<Appointment>>(`/appointments?clientId=${clientId}&limit=100`);
    return response.data;
  },

  async createAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
    return httpClient.post<Appointment>('/appointments', appointmentData);
  }
};
