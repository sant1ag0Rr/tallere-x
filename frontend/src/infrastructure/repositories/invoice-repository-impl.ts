import type { Invoice } from "@/domain/models";
import { delay } from "@/infrastructure/utils/delay";

const NOW = new Date();

const MOCK_INVOICES: Invoice[] = [
  {
    id: "inv-001",
    invoiceNumber: "INV-2026-001",
    clientId: "cli-100",
    vehicleId: "veh-001",
    workOrderIds: ["wo-001"],
    total: 82500,
    status: "paid",
    issueDate: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    dueDate: new Date(NOW.getTime() - 1000 * 60 * 60 * 24).toISOString(),
    items: [
      {
        id: "item-001",
        invoiceId: "inv-001",
        description: "Cambio de aceite 5W-30 y filtro",
        quantity: 1,
        unitPrice: 82500,
        total: 82500
      }
    ],
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString()
  },
  {
    id: "inv-002",
    invoiceNumber: "INV-2026-002",
    clientId: "cli-200",
    vehicleId: "veh-002",
    workOrderIds: ["wo-002"],
    total: 150000,
    status: "sent",
    issueDate: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    dueDate: new Date(NOW.getTime() + 1000 * 60 * 60 * 24 * 12).toISOString(),
    items: [
      {
        id: "item-002",
        invoiceId: "inv-002",
        description: "Revisión completa del sistema de frenos",
        quantity: 1,
        unitPrice: 150000,
        total: 150000
      }
    ],
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: "inv-003",
    invoiceNumber: "INV-2026-003",
    clientId: "cli-300",
    vehicleId: "veh-003",
    workOrderIds: [],
    total: 200000,
    status: "overdue",
    issueDate: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    dueDate: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    items: [
      {
        id: "item-003",
        invoiceId: "inv-003",
        description: "Revisión de suspensión",
        quantity: 1,
        unitPrice: 200000,
        total: 200000
      }
    ],
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    updatedAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 15).toISOString()
  },
  {
    id: "inv-004",
    invoiceNumber: "INV-2026-004",
    clientId: "cli-400",
    vehicleId: "veh-004",
    workOrderIds: [],
    total: 120000,
    status: "draft",
    issueDate: NOW.toISOString(),
    dueDate: new Date(NOW.getTime() + 1000 * 60 * 60 * 24 * 15).toISOString(),
    items: [
      {
        id: "item-004",
        invoiceId: "inv-004",
        description: "Alineación de ruedas",
        quantity: 1,
        unitPrice: 120000,
        total: 120000
      }
    ],
    createdAt: NOW.toISOString(),
    updatedAt: NOW.toISOString()
  },
  {
    id: "inv-005",
    invoiceNumber: "INV-2026-005",
    clientId: "cli-100",
    vehicleId: "veh-001",
    workOrderIds: [],
    total: 95000,
    status: "paid",
    issueDate: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    dueDate: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    items: [
      {
        id: "item-005",
        invoiceId: "inv-005",
        description: "Cambio de pastillas de freno",
        quantity: 1,
        unitPrice: 95000,
        total: 95000
      }
    ],
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString()
  }
];

export const invoiceRepository = {
  async listInvoices(status?: Invoice["status"]): Promise<Invoice[]> {
    await delay(800);
    if (!status) {
      return [...MOCK_INVOICES];
    }
    return MOCK_INVOICES.filter((inv) => inv.status === status);
  },

  async getInvoiceStats() {
    await delay(800);
    const paid = MOCK_INVOICES.filter((inv) => inv.status === "paid");
    const overdue = MOCK_INVOICES.filter((inv) => inv.status === "overdue");

    return {
      total: MOCK_INVOICES.length,
      totalRevenue: paid.reduce((sum, inv) => sum + inv.total, 0),
      pendingAmount: MOCK_INVOICES.filter((inv) => inv.status !== "paid")
        .reduce((sum, inv) => sum + inv.total, 0),
      overdueAmount: overdue.reduce((sum, inv) => sum + inv.total, 0),
      paidInvoices: paid.length,
      overdueInvoices: overdue.length
    };
  },

  async createInvoice(data: Partial<Invoice>): Promise<Invoice> {
    await delay(500);
    const newInvoice: Invoice = {
      id: `inv-${Math.random().toString(36).substr(2, 9)}`,
      invoiceNumber: data.invoiceNumber || `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      clientId: data.clientId || "",
      vehicleId: data.vehicleId || "",
      workOrderIds: data.workOrderIds || [],
      total: data.total || 0,
      status: data.status || "draft",
      issueDate: data.issueDate || new Date().toISOString(),
      dueDate: data.dueDate || new Date().toISOString(),
      items: data.items || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    MOCK_INVOICES.unshift(newInvoice);
    return newInvoice;
  },

  async getInvoicesByClientId(clientId: string): Promise<Invoice[]> {
    await delay(800);
    return MOCK_INVOICES.filter((inv) => inv.clientId === clientId);
  }
};
