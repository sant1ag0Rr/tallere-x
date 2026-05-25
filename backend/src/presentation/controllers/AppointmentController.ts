import { Response } from 'express';
import { AppointmentUseCases } from '../../application/useCases/AppointmentUseCases';
import { PrismaAppointmentRepository } from '../../infrastructure/repositories/PrismaAppointmentRepository';
import { toSnakeCaseObject } from '../utils/caseTransform';
import { AuthRequest } from '../middlewares/authMiddleware';
import { AppointmentFilters } from '../../application/dtos/CommonDtos';
import { appointments } from '@prisma/client';

export class AppointmentController {
  private useCases: AppointmentUseCases;

  constructor() {
    const repository = new PrismaAppointmentRepository();
    this.useCases = new AppointmentUseCases(repository);
  }

  getAll = async (req: AuthRequest, res: Response): Promise<void> => {
    const filters = req.query as unknown as AppointmentFilters;
    const data = await this.useCases.getAppointmentsPaginated({
      ...filters,
      clientId: req.user?.role === 'client' ? req.user.sub : filters.clientId
    });
    res.status(200).json({ success: true, ...data });
  };

  getById = async (req: AuthRequest, res: Response): Promise<void> => {
    const data = await this.useCases.getAppointmentById(String(req.params.id));
    if (!data) {
      res.status(404).json({ success: false, message: 'Not found', details: [] });
      return;
    }
    if (req.user?.role === 'client' && data.client_id !== req.user.sub) {
      res.status(403).json({ success: false, message: 'Forbidden: resource does not belong to user', details: [] });
      return;
    }
    res.status(200).json({ success: true, data });
  };

  create = async (req: AuthRequest, res: Response): Promise<void> => {
    const { clientId, vehicleId, serviceType, date, time, notes } = req.body;
    const data = await this.useCases.createAppointment({
      client_id: req.user?.role === 'client' ? req.user.sub : clientId,
      vehicle_id: vehicleId,
      service_type: serviceType,
      date,
      time: new Date(`${date.toISOString().slice(0, 10)}T${time}:00Z`),
      status: 'scheduled',
      notes: notes || null
    });
    res.status(201).json({ success: true, data });
  };

  update = async (req: AuthRequest, res: Response): Promise<void> => {
    const current = await this.useCases.getAppointmentById(String(req.params.id));
    if (req.user?.role === 'client' && current?.client_id !== req.user.sub) {
      res.status(403).json({ success: false, message: 'Forbidden: resource does not belong to user', details: [] });
      return;
    }
    const data = await this.useCases.updateAppointment(String(req.params.id), toSnakeCaseObject(req.body) as Partial<appointments>);
    res.status(200).json({ success: true, data });
  };

  delete = async (req: AuthRequest, res: Response): Promise<void> => {
    await this.useCases.deleteAppointment(String(req.params.id));
    res.status(204).send();
  };
}
