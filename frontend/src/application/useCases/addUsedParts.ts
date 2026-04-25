import { workOrderRepository } from '@/infrastructure/repositories/work-order-repository-impl';
import { inventoryRepository } from '@/infrastructure/repositories/inventory-repository-impl';
import type { WorkOrder, UsedPart } from '@/domain/models';

export const addUsedPartsUseCase = async (orderId: string, parts: UsedPart[]): Promise<WorkOrder> => {
  const order = await workOrderRepository.getWorkOrderById(orderId);
  if (!order) throw new Error("Order not found");
  
  for (const part of parts) {
    await inventoryRepository.deductStock(part.item.id, part.quantity);
  }

  const updatedOrder = {
    ...order,
    usedParts: [...(order.usedParts || []), ...parts]
  };
  
  return await workOrderRepository.updateWorkOrder(updatedOrder);
};
