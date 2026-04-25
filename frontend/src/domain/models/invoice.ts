import type { InvoiceItem } from "./invoice-item";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  vehicleId: string;
  workOrderIds: string[];
  total: number;
  status: "draft" | "sent" | "paid" | "overdue";
  issueDate: string;
  dueDate: string;
  items?: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}
