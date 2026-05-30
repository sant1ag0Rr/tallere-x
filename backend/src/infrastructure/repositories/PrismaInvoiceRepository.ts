import { IInvoiceRepository } from '../../domain/repositories/IInvoiceRepository';
import { invoices } from '@prisma/client';
import prisma from '../database/prisma';

export class PrismaInvoiceRepository implements IInvoiceRepository {
  async findAll(): Promise<invoices[]> {
    return prisma.invoices.findMany({
      orderBy: { issue_date: 'desc' }
    });
  }

  async findById(id: string): Promise<invoices | null> {
    return prisma.invoices.findUnique({ where: { id } });
  }

  private sanitizeData(data: any): any {
    const { 
      id, created_at, updated_at, createdAt, updatedAt,
      invoice_items, profiles, profile, vehicles, vehicle, client_name,
      client_id, vehicle_id,
      ...validData
    } = data;

    const sanitized: any = { ...validData };

    if (client_id) {
      sanitized.profiles = { connect: { id: client_id } };
    }
    if (vehicle_id) {
      sanitized.vehicles = { connect: { id: vehicle_id } };
    }

    return sanitized;
  }

  async create(data: Omit<invoices, 'id' | 'createdAt' | 'updatedAt'>): Promise<invoices> {
    return prisma.invoices.create({ data: this.sanitizeData(data) });
  }

  async update(id: string, data: Partial<invoices>): Promise<invoices> {
    return prisma.invoices.update({
      where: { id },
      data: this.sanitizeData(data)
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.invoices.delete({ where: { id } });
  }
}
