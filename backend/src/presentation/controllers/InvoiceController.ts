import { Request, Response } from 'express';
import { InvoiceUseCases } from '../../application/useCases/InvoiceUseCases';
import { PrismaInvoiceRepository } from '../../infrastructure/repositories/PrismaInvoiceRepository';
import { toSnakeCaseObject } from '../utils/caseTransform';

export class InvoiceController {
  private useCases: InvoiceUseCases;

  constructor() {
    const repository = new PrismaInvoiceRepository();
    this.useCases = new InvoiceUseCases(repository);
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.useCases.getInvoices();
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.useCases.getInvoiceById(req.params.id as string);
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { invoiceNumber, clientId, vehicleId, total, status, dueDate } = req.body;
      const data = await this.useCases.createInvoice({
        invoice_number: invoiceNumber,
        client_id: clientId || null,
        vehicle_id: vehicleId || null,
        total: total ? parseFloat(total) : 0,
        status: status || 'draft',
        issue_date: new Date(),
        due_date: dueDate ? new Date(dueDate) : null
      } as any);
      res.status(201).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.useCases.updateInvoice(req.params.id as string, toSnakeCaseObject(req.body) as any);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.useCases.deleteInvoice(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
