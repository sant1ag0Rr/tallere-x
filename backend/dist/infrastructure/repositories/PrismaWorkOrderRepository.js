"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaWorkOrderRepository = void 0;
const prisma_1 = __importDefault(require("../database/prisma"));
class PrismaWorkOrderRepository {
    async findAll() {
        return prisma_1.default.work_orders.findMany({
            include: {
                vehicles: {
                    include: {
                        profiles: true
                    }
                },
                work_order_parts: {
                    include: {
                        inventory_items: true
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        });
    }
    async findById(id) {
        return prisma_1.default.work_orders.findUnique({
            where: { id },
            include: {
                vehicles: {
                    include: {
                        profiles: true
                    }
                },
                work_order_parts: {
                    include: {
                        inventory_items: true
                    }
                }
            }
        });
    }
    async create(data) {
        return prisma_1.default.work_orders.create({ data: data });
    }
    async update(id, data) {
        return prisma_1.default.work_orders.update({
            where: { id },
            data: data
        });
    }
    async delete(id) {
        await prisma_1.default.work_orders.delete({ where: { id } });
    }
}
exports.PrismaWorkOrderRepository = PrismaWorkOrderRepository;
