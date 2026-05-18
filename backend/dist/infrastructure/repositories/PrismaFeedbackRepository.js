"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaFeedbackRepository = void 0;
const prisma_1 = __importDefault(require("../database/prisma"));
class PrismaFeedbackRepository {
    async findAll(workOrderId) {
        return prisma_1.default.feedback.findMany({
            where: workOrderId ? { work_order_id: workOrderId } : undefined,
            orderBy: { created_at: 'desc' }
        });
    }
    async create(data) {
        return prisma_1.default.feedback.create({ data: data });
    }
}
exports.PrismaFeedbackRepository = PrismaFeedbackRepository;
