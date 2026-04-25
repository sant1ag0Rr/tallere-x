import { workOrderRepository } from '@/infrastructure/repositories/work-order-repository-impl';
import type { WorkOrder } from '@/domain/models';

export const updateWorkOrderUseCase = async (orderId: string, updates: Partial<WorkOrder>): Promise<WorkOrder> => {
  const order = await workOrderRepository.getWorkOrderById(orderId);
  if (!order) throw new Error("Order not found");
  
  return await workOrderRepository.updateWorkOrder({ ...order, ...updates });
};
