"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaAppointmentRepository = void 0;
const prisma_1 = __importDefault(require("../database/prisma"));
class PrismaAppointmentRepository {
    async findAll() {
        return prisma_1.default.appointments.findMany({
            orderBy: { date: 'desc' }
        });
    }
    async findById(id) {
        return prisma_1.default.appointments.findUnique({ where: { id } });
    }
    async findByClientId(clientId) {
        return prisma_1.default.appointments.findMany({ where: { client_id: clientId } });
    }
    async create(data) {
        return prisma_1.default.appointments.create({ data: data });
    }
    async update(id, data) {
        return prisma_1.default.appointments.update({
            where: { id },
            data: data
        });
    }
    async delete(id) {
        await prisma_1.default.appointments.delete({ where: { id } });
    }
}
exports.PrismaAppointmentRepository = PrismaAppointmentRepository;
