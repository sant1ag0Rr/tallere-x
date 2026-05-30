"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaVehicleRepository = void 0;
const CommonDtos_1 = require("../../application/dtos/CommonDtos");
const prisma_1 = __importDefault(require("../database/prisma"));
class PrismaVehicleRepository {
    async findAll() {
        return prisma_1.default.vehicles.findMany();
    }
    async findPaginated(filters) {
        const where = {
            ...(filters.clientId ? { assigned_client_id: filters.clientId } : {}),
            ...(filters.status ? { status: filters.status } : {}),
            ...(filters.plate ? { plate: { contains: filters.plate, mode: 'insensitive' } } : {}),
            ...(filters.search
                ? {
                    OR: [
                        { plate: { contains: filters.search, mode: 'insensitive' } },
                        { brand: { contains: filters.search, mode: 'insensitive' } },
                        { model: { contains: filters.search, mode: 'insensitive' } }
                    ]
                }
                : {})
        };
        const [data, total] = await prisma_1.default.$transaction([
            prisma_1.default.vehicles.findMany({
                where,
                skip: (filters.page - 1) * filters.limit,
                take: filters.limit,
                orderBy: { created_at: 'desc' }
            }),
            prisma_1.default.vehicles.count({ where })
        ]);
        return (0, CommonDtos_1.paginate)(data, filters.page, filters.limit, total);
    }
    async findById(id) {
        return prisma_1.default.vehicles.findUnique({ where: { id } });
    }
    sanitizeData(data) {
        const { id, created_at, updated_at, createdAt, updatedAt, profile, profiles, appointments, invoices, work_orders, assigned_client_id, ...validData } = data;
        const sanitized = { ...validData };
        if (assigned_client_id) {
            sanitized.profiles = { connect: { id: assigned_client_id } };
        }
        return sanitized;
    }
    async create(data) {
        return prisma_1.default.vehicles.create({ data: this.sanitizeData(data) });
    }
    async update(id, data) {
        return prisma_1.default.vehicles.update({
            where: { id },
            data: this.sanitizeData(data)
        });
    }
    async delete(id) {
        await prisma_1.default.vehicles.delete({ where: { id } });
    }
}
exports.PrismaVehicleRepository = PrismaVehicleRepository;
