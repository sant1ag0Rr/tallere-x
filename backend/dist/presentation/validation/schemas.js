"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppointmentBodySchema = exports.createAppointmentBodySchema = exports.updateVehicleBodySchema = exports.createVehicleBodySchema = exports.registerBodySchema = exports.loginBodySchema = exports.appointmentQuerySchema = exports.vehicleQuerySchema = exports.userQuerySchema = exports.paginationQuerySchema = exports.idParamSchema = exports.uuidSchema = void 0;
const zod_1 = require("zod");
const Auth_1 = require("../../domain/models/Auth");
exports.uuidSchema = zod_1.z.string().uuid('Must be a valid UUID');
exports.idParamSchema = zod_1.z.object({
    id: exports.uuidSchema
});
exports.paginationQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
    search: zod_1.z.string().trim().min(1).max(120).optional()
});
exports.userQuerySchema = exports.paginationQuerySchema.extend({
    role: zod_1.z.enum(Auth_1.USER_ROLES).optional()
});
exports.vehicleQuerySchema = exports.paginationQuerySchema.extend({
    status: zod_1.z.string().trim().min(1).max(40).optional(),
    plate: zod_1.z.string().trim().min(1).max(20).optional(),
    clientId: exports.uuidSchema.optional()
});
exports.appointmentQuerySchema = exports.paginationQuerySchema.extend({
    status: zod_1.z.string().trim().min(1).max(40).optional(),
    clientId: exports.uuidSchema.optional(),
    vehicleId: exports.uuidSchema.optional(),
    from: zod_1.z.coerce.date().optional(),
    to: zod_1.z.coerce.date().optional()
});
exports.loginBodySchema = zod_1.z.object({
    email: zod_1.z.string().trim().toLowerCase().email(),
    password: zod_1.z.string().min(8).max(128)
});
exports.registerBodySchema = exports.loginBodySchema.extend({
    role: zod_1.z.enum(Auth_1.USER_ROLES),
    firstName: zod_1.z.string().trim().min(1).max(80),
    lastName: zod_1.z.string().trim().min(1).max(80),
    phone: zod_1.z.string().trim().max(30).optional().nullable(),
    avatarUrl: zod_1.z.string().trim().url().optional().nullable()
});
exports.createVehicleBodySchema = zod_1.z.object({
    vin: zod_1.z.string().trim().max(40).optional().nullable(),
    plate: zod_1.z.string().trim().min(3).max(20),
    brand: zod_1.z.string().trim().max(60).optional().nullable(),
    model: zod_1.z.string().trim().max(60).optional().nullable(),
    year: zod_1.z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1).optional().nullable(),
    mileage: zod_1.z.coerce.number().int().min(0).optional().nullable(),
    status: zod_1.z.string().trim().max(40).optional(),
    assignedClientId: exports.uuidSchema.optional().nullable()
});
exports.updateVehicleBodySchema = exports.createVehicleBodySchema.partial();
exports.createAppointmentBodySchema = zod_1.z.object({
    clientId: exports.uuidSchema,
    vehicleId: exports.uuidSchema,
    serviceType: zod_1.z.string().trim().min(1).max(120),
    date: zod_1.z.coerce.date(),
    time: zod_1.z.string().regex(/^\d{2}:\d{2}$/, 'time must be HH:mm'),
    notes: zod_1.z.string().trim().max(1000).optional().nullable()
});
exports.updateAppointmentBodySchema = zod_1.z.object({
    status: zod_1.z.string().trim().max(40).optional(),
    notes: zod_1.z.string().trim().max(1000).optional().nullable(),
    date: zod_1.z.coerce.date().optional(),
    time: zod_1.z.string().regex(/^\d{2}:\d{2}$/, 'time must be HH:mm').optional()
});
