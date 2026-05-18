import { invoices } from '@prisma/client';

export interface IInvoiceRepository {
  findAll(): Promise<invoices[]>;
  findById(id: string): Promise<invoices | null>;
  create(data: Omit<invoices, 'id' | 'createdAt' | 'updatedAt'>): Promise<invoices>;
  update(id: string, data: Partial<invoices>): Promise<invoices>;
  delete(id: string): Promise<void>;
}
