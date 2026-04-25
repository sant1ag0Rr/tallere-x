import { appointmentRepository } from '@/infrastructure/repositories/appointment-repository-impl';
import type { Appointment } from '@/domain/models';

export const getClientAppointmentsUseCase = async (clientId: string): Promise<Appointment[]> => {
  return await appointmentRepository.getAppointmentsByClientId(clientId);
};
