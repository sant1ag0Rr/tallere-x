import { workOrderRepository } from '@/infrastructure/repositories/work-order-repository-impl';
import { vehicleRepository } from '@/infrastructure/repositories/vehicle-repository-impl';
import type { WorkOrder } from '@/domain/models';

export const getClientOrdersUseCase = async (clientId: string): Promise<WorkOrder[]> => {
  const vehicles = await vehicleRepository.getVehiclesByClientId(clientId);
  const orders: WorkOrder[] = [];
  for (const v of vehicles) {
    const vOrders = await workOrderRepository.getWorkOrdersByVehicleId(v.id);
    orders.push(...vOrders.filter(o => o.status === 'pending' || o.status === 'in_progress'));
  }
  return orders;
};
