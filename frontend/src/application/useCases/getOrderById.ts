import { workOrderRepository } from '@/infrastructure/repositories/work-order-repository-impl';
import type { WorkOrder } from '@/domain/models';

export const getOrderByIdUseCase = async (id: string): Promise<WorkOrder | undefined> => {
  return await workOrderRepository.getWorkOrderById(id);
};
