import { vehicleRepository } from '@/infrastructure/repositories/vehicle-repository-impl';
import type { Vehicle } from '@/domain/models';

export const addClientVehicleUseCase = async (vehicle: Partial<Vehicle>): Promise<Vehicle> => {
  return await vehicleRepository.createVehicle(vehicle);
};
