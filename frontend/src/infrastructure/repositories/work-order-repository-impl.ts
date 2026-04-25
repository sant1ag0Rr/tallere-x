import type { WorkOrder } from "@/domain/models";
import { delay } from "@/infrastructure/utils/delay";

const NOW = new Date();

const MOCK_WORK_ORDERS: WorkOrder[] = [
  {
    id: "wo-001",
    vehicleId: "veh-001",
    title: "Cambio de aceite",
    description: "Cambio de aceite 5W-30 y filtro de aceite",
    status: "completed",
    priority: "medium",
    estimatedCost: 85000,
    actualCost: 82500,
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    completedAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 4).toISOString()
  },
  {
    id: "wo-002",
    vehicleId: "veh-002",
    title: "Revisión de frenos",
    description: "Revisión completa del sistema de frenos y pastillas",
    status: "in_progress",
    priority: "high",
    estimatedCost: 150000,
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: NOW.toISOString()
  },
  {
    id: "wo-003",
    vehicleId: "veh-003",
    title: "Revisión de suspensión",
    description: "Inspección general de la suspensión y amortiguadores",
    status: "pending",
    priority: "medium",
    estimatedCost: 200000,
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: "wo-004",
    vehicleId: "veh-004",
    title: "Alineación de ruedas",
    description: "Alineación de las cuatro ruedas",
    status: "completed",
    priority: "low",
    estimatedCost: 120000,
    actualCost: 120000,
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    completedAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString()
  },
  {
    id: "wo-005",
    vehicleId: "veh-001",
    title: "Cambio de pastillas de freno",
    description: "Cambio de pastillas delanteras",
    status: "pending",
    priority: "high",
    estimatedCost: 95000,
    createdAt: NOW.toISOString(),
    updatedAt: NOW.toISOString()
  }
];

export const workOrderRepository = {
  async listWorkOrders(status?: WorkOrder["status"]): Promise<WorkOrder[]> {
    await delay(800);
    if (!status) {
      return [...MOCK_WORK_ORDERS];
    }
    return MOCK_WORK_ORDERS.filter((wo) => wo.status === status);
  },

  async getWorkOrdersByVehicleId(vehicleId: string): Promise<WorkOrder[]> {
    await delay(800);
    return MOCK_WORK_ORDERS.filter((wo) => wo.vehicleId === vehicleId);
  },

  async getWorkOrdersStats() {
    await delay(800);
    return {
      total: MOCK_WORK_ORDERS.length,
      pending: MOCK_WORK_ORDERS.filter((wo) => wo.status === "pending").length,
      inProgress: MOCK_WORK_ORDERS.filter((wo) => wo.status === "in_progress").length,
      completed: MOCK_WORK_ORDERS.filter((wo) => wo.status === "completed").length,
      totalRevenue: MOCK_WORK_ORDERS.filter((wo) => wo.actualCost)
        .reduce((sum, wo) => sum + (wo.actualCost ?? 0), 0)
    };
  },

  async createWorkOrder(data: Partial<WorkOrder>): Promise<WorkOrder> {
    await delay(500);
    const newOrder: WorkOrder = {
      id: `wo-${Math.random().toString(36).substr(2, 9)}`,
      vehicleId: data.vehicleId || "",
      title: data.title || "",
      description: data.description || "",
      status: data.status || "pending",
      priority: data.priority || "medium",
      estimatedCost: data.estimatedCost || 0,
      actualCost: data.actualCost,
      reportedProblem: data.reportedProblem,
      diagnosis: data.diagnosis,
      repairs: data.repairs,
      usedParts: data.usedParts || [],
      workedMinutes: data.workedMinutes || 0,
      images: data.images || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    MOCK_WORK_ORDERS.unshift(newOrder);
    return newOrder;
  },

  async getWorkOrderById(id: string): Promise<WorkOrder | undefined> {
    await delay(500);
    return MOCK_WORK_ORDERS.find(wo => wo.id === id);
  },

  async updateWorkOrder(data: WorkOrder): Promise<WorkOrder> {
    await delay(500);
    const index = MOCK_WORK_ORDERS.findIndex(wo => wo.id === data.id);
    if (index !== -1) {
      MOCK_WORK_ORDERS[index] = { ...data, updatedAt: new Date().toISOString() };
      return MOCK_WORK_ORDERS[index];
    }
    throw new Error("Work order not found");
  }
};
