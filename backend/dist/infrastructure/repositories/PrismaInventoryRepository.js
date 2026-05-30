"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaInventoryRepository = void 0;
const prisma_1 = __importDefault(require("../database/prisma"));
class PrismaInventoryRepository {
    async findAll() {
        return prisma_1.default.inventory_items.findMany();
    }
    async findById(id) {
        return prisma_1.default.inventory_items.findUnique({ where: { id } });
    }
    sanitizeData(data) {
        const { id, created_at, updated_at, createdAt, updatedAt, work_order_parts, ...validData } = data;
        return validData;
    }
    async create(data) {
        return prisma_1.default.inventory_items.create({ data: this.sanitizeData(data) });
    }
    async update(id, data) {
        return prisma_1.default.inventory_items.update({
            where: { id },
            data: this.sanitizeData(data)
        });
    }
    async delete(id) {
        await prisma_1.default.inventory_items.delete({ where: { id } });
    }
}
exports.PrismaInventoryRepository = PrismaInventoryRepository;
