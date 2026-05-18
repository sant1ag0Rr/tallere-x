import { Request, Response } from 'express';
import { AppointmentUseCases } from '../../application/useCases/AppointmentUseCases';
import { PrismaAppointmentRepository } from '../../infrastructure/repositories/PrismaAppointmentRepository';
import { toSnakeCaseObject } from '../utils/caseTransform';

export class AppointmentController {
  private useCases: AppointmentUseCases;

  constructor() {
    const repository = new PrismaAppointmentRepository();
    this.useCases = new AppointmentUseCases(repository);
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.useCases.getAppointments();
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.useCases.getAppointmentById(req.params.id as string);
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
      const { clientId, vehicleId, serviceType, date, time, notes } = req.body;
      const data = await this.useCases.createAppointment({
        client_id: clientId,
        vehicle_id: vehicleId,
        service_type: serviceType,
        date: new Date(date),
        time: new Date(`${date}T${time}:00Z`),
        status: 'scheduled',
        notes: notes || null
      } as any);
      res.status(201).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.useCases.updateAppointment(req.params.id as string, toSnakeCaseObject(req.body) as any);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.useCases.deleteAppointment(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
