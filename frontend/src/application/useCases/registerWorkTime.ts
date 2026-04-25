import { workOrderRepository } from '@/infrastructure/repositories/work-order-repository-impl';
import type { WorkOrder } from '@/domain/models';

export const registerWorkTimeUseCase = async (orderId: string, minutes: number): Promise<WorkOrder> => {
  const order = await workOrderRepository.getWorkOrderById(orderId);
  if (!order) throw new Error("Order not found");
  
  const updatedOrder = {
    ...order,
    workedMinutes: (order.workedMinutes || 0) + minutes
  };
  return await workOrderRepository.updateWorkOrder(updatedOrder);
};
