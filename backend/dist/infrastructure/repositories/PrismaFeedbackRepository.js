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
    sanitizeData(data) {
        const { id, created_at, updated_at, createdAt, updatedAt, profiles, profile, work_orders, work_order, client_name, client_id, work_order_id, ...validData } = data;
        const sanitized = { ...validData };
        if (client_id) {
            sanitized.profiles = { connect: { id: client_id } };
        }
        if (work_order_id) {
            sanitized.work_orders = { connect: { id: work_order_id } };
        }
        return sanitized;
    }
    async create(data) {
        return prisma_1.default.feedback.create({ data: this.sanitizeData(data) });
    }
}
exports.PrismaFeedbackRepository = PrismaFeedbackRepository;
