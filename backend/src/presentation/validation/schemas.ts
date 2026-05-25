import { z } from 'zod';
import { USER_ROLES } from '../../domain/models/Auth';

export const uuidSchema = z.string().uuid('Must be a valid UUID');

export const idParamSchema = z.object({
  id: uuidSchema
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().min(1).max(120).optional()
});

export const userQuerySchema = paginationQuerySchema.extend({
  role: z.enum(USER_ROLES).optional()
});

export const vehicleQuerySchema = paginationQuerySchema.extend({
  status: z.string().trim().min(1).max(40).optional(),
  plate: z.string().trim().min(1).max(20).optional(),
  clientId: uuidSchema.optional()
});

export const appointmentQuerySchema = paginationQuerySchema.extend({
  status: z.string().trim().min(1).max(40).optional(),
  clientId: uuidSchema.optional(),
  vehicleId: uuidSchema.optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional()
});

export const loginBodySchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(128)
});

export const registerBodySchema = loginBodySchema.extend({
  role: z.enum(USER_ROLES),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  phone: z.string().trim().max(30).optional().nullable(),
  avatarUrl: z.string().trim().url().optional().nullable()
});

export const createVehicleBodySchema = z.object({
  vin: z.string().trim().max(40).optional().nullable(),
  plate: z.string().trim().min(3).max(20),
  brand: z.string().trim().max(60).optional().nullable(),
  model: z.string().trim().max(60).optional().nullable(),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1).optional().nullable(),
  mileage: z.coerce.number().int().min(0).optional().nullable(),
  status: z.string().trim().max(40).optional(),
  assignedClientId: uuidSchema.optional().nullable()
});

export const updateVehicleBodySchema = createVehicleBodySchema.partial();

export const createAppointmentBodySchema = z.object({
  clientId: uuidSchema,
  vehicleId: uuidSchema,
  serviceType: z.string().trim().min(1).max(120),
  date: z.coerce.date(),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'time must be HH:mm'),
  notes: z.string().trim().max(1000).optional().nullable()
});

export const updateAppointmentBodySchema = z.object({
  status: z.string().trim().max(40).optional(),
  notes: z.string().trim().max(1000).optional().nullable(),
  date: z.coerce.date().optional(),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'time must be HH:mm').optional()
});
