import type { Appointment } from "@/domain/models";
import type { AppointmentStatus } from "@/domain/constants";
import { delay } from "@/infrastructure/utils/delay";

const NOW = new Date();

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "app-001",
    clientId: "cli-100",
    vehicleId: "veh-001",
    serviceType: "Mantenimiento preventivo",
    date: new Date(NOW.getTime() + 1000 * 60 * 60 * 24).toISOString().split('T')[0],
    time: "10:00",
    status: "scheduled",
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 4).toISOString(),
    updatedAt: NOW.toISOString()
  },
  {
    id: "app-002",
    clientId: "cli-200",
    vehicleId: "veh-002",
    serviceType: "Revision de frenos",
    date: NOW.toISOString().split('T')[0],
    time: "14:30",
    status: "in_progress",
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 3).toISOString(),
    updatedAt: NOW.toISOString()
  },
  {
    id: "app-003",
    clientId: "cli-300",
    vehicleId: "veh-003",
    serviceType: "Cambio de aceite",
    date: new Date(NOW.getTime() - 1000 * 60 * 60 * 24).toISOString().split('T')[0],
    time: "09:15",
    status: "completed",
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 7).toISOString(),
    updatedAt: NOW.toISOString()
  }
];

export const appointmentRepository = {
  async listAppointments(status?: AppointmentStatus): Promise<Appointment[]> {
    await delay(800);
    if (!status) {
      return [...MOCK_APPOINTMENTS];
    }

    return MOCK_APPOINTMENTS.filter((appointment) => appointment.status === status);
  },

  async getAppointmentsToday(): Promise<Appointment[]> {
    await delay(800);
    const today = NOW.toISOString().slice(0, 10);
    return MOCK_APPOINTMENTS.filter((appointment) => appointment.date === today);
  },

  async getAppointmentsByClientId(clientId: string): Promise<Appointment[]> {
    await delay(800);
    return MOCK_APPOINTMENTS.filter((appointment) => appointment.clientId === clientId);
  },

  async createAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
    await delay(600);
    
    const exists = MOCK_APPOINTMENTS.find(a => a.date === appointmentData.date && a.time === appointmentData.time);
    if (exists) {
      throw new Error('Ese horario ya no está disponible');
    }

    const newAppointment: Appointment = {
      id: `app-${Math.random().toString(36).substr(2, 9)}`,
      clientId: appointmentData.clientId || "",
      vehicleId: appointmentData.vehicleId || "",
      serviceType: appointmentData.serviceType || "",
      date: appointmentData.date || "",
      time: appointmentData.time || "",
      status: "scheduled",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    MOCK_APPOINTMENTS.push(newAppointment);
    return newAppointment;
  }
};
