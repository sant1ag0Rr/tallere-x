import type { WorkOrder } from "@/domain/models";
import { httpClient } from "../http/httpClient";

type ApiWorkOrder = WorkOrder & {
  vehicles?: WorkOrder["vehicle"] & {
    profiles?: {
      firstName?: string;
      lastName?: string;
      email?: string;
    } | null;
  };
  workOrderParts?: Array<{
    quantity: number;
    inventoryItems?: any;
  }>;
};

const normalizeWorkOrder = (order: ApiWorkOrder): WorkOrder => {
  const vehicle = order.vehicle ?? order.vehicles ?? {
    id: order.vehicleId,
    plate: "Sin placa",
    brand: "Vehiculo",
    model: "sin datos",
    year: new Date().getFullYear(),
    mileage: 0,
    status: "available",
    maintenanceHistory: [],
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };

  const profile = order.vehicles?.profiles;
  const clientName = order.clientName
    || [profile?.firstName, profile?.lastName].filter(Boolean).join(" ")
    || profile?.email
    || "Cliente sin asignar";

  return {
    ...order,
    vehicle,
    clientName,
    title: order.title ?? "Orden de trabajo",
    description: order.description ?? "",
    reportedProblem: order.reportedProblem ?? order.description ?? "Sin problema reportado",
    priority: order.priority ?? "medium",
    estimatedCost: Number(order.estimatedCost ?? 0),
    actualCost: order.actualCost == null ? undefined : Number(order.actualCost),
    workedMinutes: order.workedMinutes ?? 0,
    usedParts: order.usedParts ?? order.workOrderParts?.map((part) => ({
      item: part.inventoryItems,
      quantity: part.quantity
    })).filter((part) => Boolean(part.item)) ?? []
  };
};

export const workOrderRepository = {
  async listWorkOrders(status?: WorkOrder["status"]): Promise<WorkOrder[]> {
    const workOrders = (await httpClient.get<ApiWorkOrder[]>('/work-orders')).map(normalizeWorkOrder);
    if (!status) {
      return workOrders;
    }
    return workOrders.filter((wo) => wo.status === status);
  },

  async getWorkOrdersByVehicleId(vehicleId: string): Promise<WorkOrder[]> {
    const workOrders = (await httpClient.get<ApiWorkOrder[]>('/work-orders')).map(normalizeWorkOrder);
    return workOrders.filter((wo) => wo.vehicleId === vehicleId);
  },

  async getWorkOrdersStats() {
    const workOrders = (await httpClient.get<ApiWorkOrder[]>('/work-orders')).map(normalizeWorkOrder);
    return {
      total: workOrders.length,
      pending: workOrders.filter((wo) => wo.status === "pending").length,
      inProgress: workOrders.filter((wo) => wo.status === "in_progress").length,
      completed: workOrders.filter((wo) => wo.status === "completed").length,
      totalRevenue: workOrders.filter((wo) => wo.actualCost)
        .reduce((sum, wo) => sum + (wo.actualCost ?? 0), 0)
    };
  },

  async createWorkOrder(data: Partial<WorkOrder>): Promise<WorkOrder> {
    return normalizeWorkOrder(await httpClient.post<ApiWorkOrder>('/work-orders', data));
  },

  async getWorkOrderById(id: string): Promise<WorkOrder | undefined> {
    try {
      return normalizeWorkOrder(await httpClient.get<ApiWorkOrder>(`/work-orders/${id}`));
    } catch (e) {
      return undefined;
    }
  },

  async updateWorkOrder(data: WorkOrder): Promise<WorkOrder> {
    return normalizeWorkOrder(await httpClient.put<ApiWorkOrder>(`/work-orders/${data.id}`, data));
  }
};
