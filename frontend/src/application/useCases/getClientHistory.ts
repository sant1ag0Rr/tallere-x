import { workOrderRepository } from '@/infrastructure/repositories/work-order-repository-impl';
import { vehicleRepository } from '@/infrastructure/repositories/vehicle-repository-impl';
import type { WorkOrder } from '@/domain/models';

export const getClientHistoryUseCase = async (clientId: string): Promise<WorkOrder[]> => {
  const vehicles = await vehicleRepository.getVehiclesByClientId(clientId);
  const orders: WorkOrder[] = [];
  for (const v of vehicles) {
    const vOrders = await workOrderRepository.getWorkOrdersByVehicleId(v.id);
    orders.push(...vOrders.filter(o => o.status === 'completed' || o.status === 'cancelled'));
  }
  return orders;
};
