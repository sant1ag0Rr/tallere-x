"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaVehicleRepository = void 0;
const prisma_1 = __importDefault(require("../database/prisma"));
class PrismaVehicleRepository {
    async findAll() {
        return prisma_1.default.vehicles.findMany();
    }
    async findById(id) {
        return prisma_1.default.vehicles.findUnique({ where: { id } });
    }
    async create(data) {
        return prisma_1.default.vehicles.create({ data: data });
    }
    async update(id, data) {
        return prisma_1.default.vehicles.update({
            where: { id },
            data: data
        });
    }
    async delete(id) {
        await prisma_1.default.vehicles.delete({ where: { id } });
    }
}
exports.PrismaVehicleRepository = PrismaVehicleRepository;
