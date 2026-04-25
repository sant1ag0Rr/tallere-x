import { vehicleRepository } from '@/infrastructure/repositories/vehicle-repository-impl';
import type { Vehicle } from '@/domain/models';

export const getClientVehiclesUseCase = async (clientId: string): Promise<Vehicle[]> => {
  return await vehicleRepository.getVehiclesByClientId(clientId);
};
