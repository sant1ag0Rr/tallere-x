import { Request, Response } from 'express';
import { VehicleUseCases } from '../../application/useCases/VehicleUseCases';
import { PrismaVehicleRepository } from '../../infrastructure/repositories/PrismaVehicleRepository';
import { toSnakeCaseObject } from '../utils/caseTransform';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class VehicleController {
  private useCases: VehicleUseCases;

  constructor() {
    const repository = new PrismaVehicleRepository();
    this.useCases = new VehicleUseCases(repository);
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.useCases.getVehicles();
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.useCases.getVehicleById(req.params.id as string);
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
      const { vin, plate, brand, model, year, mileage, status, assignedClientId } = req.body;
      const normalizedClientId = assignedClientId?.trim() || null;

      if (normalizedClientId && !UUID_REGEX.test(normalizedClientId)) {
        res.status(400).json({ error: 'assignedClientId must be a valid UUID' });
        return;
      }

      const data = await this.useCases.createVehicle({
        vin: vin || null,
        plate,
        brand: brand || null,
        model: model || null,
        year: year ? parseInt(year) : null,
        mileage: mileage ? parseInt(mileage) : null,
        status: status || 'available',
        assigned_client_id: normalizedClientId
      } as any);
      res.status(201).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.useCases.updateVehicle(req.params.id as string, toSnakeCaseObject(req.body) as any);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.useCases.deleteVehicle(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
