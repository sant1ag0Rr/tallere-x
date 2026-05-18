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

  async create(data: Omit<invoices, 'id' | 'createdAt' | 'updatedAt'>): Promise<invoices> {
    return prisma.invoices.create({ data: data as any });
  }

  async update(id: string, data: Partial<invoices>): Promise<invoices> {
    return prisma.invoices.update({
      where: { id },
      data: data as any
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.invoices.delete({ where: { id } });
  }
}
