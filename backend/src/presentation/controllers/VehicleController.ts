import { Response } from 'express';
import { VehicleUseCases } from '../../application/useCases/VehicleUseCases';
import { PrismaVehicleRepository } from '../../infrastructure/repositories/PrismaVehicleRepository';
import { toSnakeCaseObject } from '../utils/caseTransform';
import { AuthRequest } from '../middlewares/authMiddleware';
import { VehicleFilters } from '../../application/dtos/CommonDtos';
import { vehicles } from '@prisma/client';

export class VehicleController {
  private useCases: VehicleUseCases;

  constructor() {
    const repository = new PrismaVehicleRepository();
    this.useCases = new VehicleUseCases(repository);
  }

  getAll = async (req: AuthRequest, res: Response): Promise<void> => {
    const filters = req.query as unknown as VehicleFilters;
    const data = await this.useCases.getVehiclesPaginated({
      ...filters,
      clientId: req.user?.role === 'client' ? req.user.sub : filters.clientId
    });
    res.status(200).json({ success: true, ...data });
  };

  getById = async (req: AuthRequest, res: Response): Promise<void> => {
    const data = await this.useCases.getVehicleById(String(req.params.id));
    if (!data) {
      res.status(404).json({ success: false, message: 'Not found', details: [] });
      return;
    }
    if (req.user?.role === 'client' && data.assigned_client_id !== req.user.sub) {
      res.status(403).json({ success: false, message: 'Forbidden: resource does not belong to user', details: [] });
      return;
    }
    res.status(200).json({ success: true, data });
  };

  create = async (req: AuthRequest, res: Response): Promise<void> => {
    const { vin, plate, brand, model, year, mileage, status, assignedClientId } = req.body;
    const data = await this.useCases.createVehicle({
      vin: vin || null,
      plate,
      brand: brand || null,
      model: model || null,
      year: year ?? null,
      mileage: mileage ?? null,
      status: status || 'available',
      assigned_client_id: req.user?.role === 'client' ? req.user.sub : assignedClientId ?? null
    });
    res.status(201).json({ success: true, data });
  };

  update = async (req: AuthRequest, res: Response): Promise<void> => {
    const data = await this.useCases.updateVehicle(String(req.params.id), toSnakeCaseObject(req.body) as Partial<vehicles>);
    res.status(200).json({ success: true, data });
  };

  delete = async (req: AuthRequest, res: Response): Promise<void> => {
    await this.useCases.deleteVehicle(String(req.params.id));
    res.status(204).send();
  };
}
