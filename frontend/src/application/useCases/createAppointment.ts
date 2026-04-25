import { appointmentRepository } from '@/infrastructure/repositories/appointment-repository-impl';
import type { Appointment } from '@/domain/models';

export const createAppointmentUseCase = async (appointmentData: Partial<Appointment>): Promise<Appointment> => {
  return await appointmentRepository.createAppointment(appointmentData);
};
