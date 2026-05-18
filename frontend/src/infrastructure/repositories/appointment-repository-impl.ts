import type { Appointment } from "@/domain/models";
import type { AppointmentStatus } from "@/domain/constants";
import { httpClient } from "../http/httpClient";

export const appointmentRepository = {
  async listAppointments(status?: AppointmentStatus): Promise<Appointment[]> {
    const appointments = await httpClient.get<Appointment[]>('/appointments');
    if (!status) {
      return appointments;
    }
    return appointments.filter((appointment) => appointment.status === status);
  },

  async getAppointmentsToday(): Promise<Appointment[]> {
    const appointments = await httpClient.get<Appointment[]>('/appointments');
    const today = new Date().toISOString().slice(0, 10);
    return appointments.filter((appointment) => appointment.date === today);
  },

  async getAppointmentsByClientId(clientId: string): Promise<Appointment[]> {
    // Ideally this would be an API parameter, e.g. /appointments?clientId=xxx
    const appointments = await httpClient.get<Appointment[]>('/appointments');
    return appointments.filter((appointment) => appointment.clientId === clientId);
  },

  async createAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
    return httpClient.post<Appointment>('/appointments', appointmentData);
  }
};
