import { workOrderRepository } from '@/infrastructure/repositories/work-order-repository-impl';
import type { WorkOrder } from '@/domain/models';

export const getAssignedOrdersUseCase = async (mechanicId: string): Promise<WorkOrder[]> => {
  const orders = await workOrderRepository.listWorkOrders();
  return orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
};
