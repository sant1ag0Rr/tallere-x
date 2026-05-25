"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaAppointmentRepository = void 0;
const CommonDtos_1 = require("../../application/dtos/CommonDtos");
const prisma_1 = __importDefault(require("../database/prisma"));
class PrismaAppointmentRepository {
    async findAll() {
        return prisma_1.default.appointments.findMany({
            orderBy: { date: 'desc' }
        });
    }
    async findPaginated(filters) {
        const where = {
            ...(filters.clientId ? { client_id: filters.clientId } : {}),
            ...(filters.vehicleId ? { vehicle_id: filters.vehicleId } : {}),
            ...(filters.status ? { status: filters.status } : {}),
            ...((filters.from || filters.to)
                ? {
                    date: {
                        ...(filters.from ? { gte: filters.from } : {}),
                        ...(filters.to ? { lte: filters.to } : {})
                    }
                }
                : {})
        };
        const [data, total] = await prisma_1.default.$transaction([
            prisma_1.default.appointments.findMany({
                where,
                skip: (filters.page - 1) * filters.limit,
                take: filters.limit,
                orderBy: { date: 'desc' }
            }),
            prisma_1.default.appointments.count({ where })
        ]);
        return (0, CommonDtos_1.paginate)(data, filters.page, filters.limit, total);
    }
    async findById(id) {
        return prisma_1.default.appointments.findUnique({ where: { id } });
    }
    async findByClientId(clientId) {
        return prisma_1.default.appointments.findMany({ where: { client_id: clientId } });
    }
    async create(data) {
        return prisma_1.default.appointments.create({ data });
    }
    async update(id, data) {
        return prisma_1.default.appointments.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        await prisma_1.default.appointments.delete({ where: { id } });
    }
}
exports.PrismaAppointmentRepository = PrismaAppointmentRepository;
