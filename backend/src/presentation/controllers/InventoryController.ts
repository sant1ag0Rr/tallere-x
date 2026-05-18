import { Request, Response } from 'express';
import { InventoryUseCases } from '../../application/useCases/InventoryUseCases';
import { PrismaInventoryRepository } from '../../infrastructure/repositories/PrismaInventoryRepository';
import { toSnakeCaseObject } from '../utils/caseTransform';

export class InventoryController {
  private useCases: InventoryUseCases;

  constructor() {
    const repository = new PrismaInventoryRepository();
    this.useCases = new InventoryUseCases(repository);
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.useCases.getInventoryItems();
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.useCases.getInventoryItemById(req.params.id as string);
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
      const { name, sku, category, quantity, minQuantity, unitPrice, supplier } = req.body;
      const data = await this.useCases.createInventoryItem({
        name,
        sku,
        category: category || null,
        quantity: quantity ? parseInt(quantity) : 0,
        min_quantity: minQuantity ? parseInt(minQuantity) : 5,
        unit_price: unitPrice ? parseFloat(unitPrice) : null,
        supplier: supplier || null,
        last_restock_date: null
      } as any);
      res.status(201).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.useCases.updateInventoryItem(req.params.id as string, toSnakeCaseObject(req.body) as any);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.useCases.deleteInventoryItem(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
