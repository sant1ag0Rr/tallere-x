import { IInvoiceRepository } from '../../domain/repositories/IInvoiceRepository';
import { invoices } from '@prisma/client';

export class InvoiceUseCases {
  constructor(private repository: IInvoiceRepository) {}

  async getInvoices(): Promise<invoices[]> {
    return this.repository.findAll();
  }

  async getInvoiceById(id: string): Promise<invoices | null> {
    return this.repository.findById(id);
  }

  async createInvoice(data: Omit<invoices, 'id' | 'createdAt' | 'updatedAt'>): Promise<invoices> {
    return this.repository.create(data);
  }

  async updateInvoice(id: string, data: Partial<invoices>): Promise<invoices> {
    return this.repository.update(id, data);
  }

  async deleteInvoice(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
