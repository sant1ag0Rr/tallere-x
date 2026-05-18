import type { Invoice } from "@/domain/models";
import { httpClient } from "../http/httpClient";

export const invoiceRepository = {
  async listInvoices(status?: Invoice["status"]): Promise<Invoice[]> {
    const invoices = await httpClient.get<Invoice[]>('/invoices');
    if (!status) {
      return invoices;
    }
    return invoices.filter((inv) => inv.status === status);
  },

  async getInvoiceStats() {
    const invoices = await httpClient.get<Invoice[]>('/invoices');
    const paid = invoices.filter((inv) => inv.status === "paid");
    const overdue = invoices.filter((inv) => inv.status === "overdue");

    return {
      total: invoices.length,
      totalRevenue: paid.reduce((sum, inv) => sum + (inv.total || 0), 0),
      pendingAmount: invoices.filter((inv) => inv.status !== "paid")
        .reduce((sum, inv) => sum + (inv.total || 0), 0),
      overdueAmount: overdue.reduce((sum, inv) => sum + (inv.total || 0), 0),
      paidInvoices: paid.length,
      overdueInvoices: overdue.length
    };
  },

  async createInvoice(data: Partial<Invoice>): Promise<Invoice> {
    return httpClient.post<Invoice>('/invoices', data);
  },

  async getInvoicesByClientId(clientId: string): Promise<Invoice[]> {
    const invoices = await httpClient.get<Invoice[]>('/invoices');
    return invoices.filter((inv) => inv.clientId === clientId);
  }
};
