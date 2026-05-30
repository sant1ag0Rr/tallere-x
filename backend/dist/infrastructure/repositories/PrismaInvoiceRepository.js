"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaInvoiceRepository = void 0;
const prisma_1 = __importDefault(require("../database/prisma"));
class PrismaInvoiceRepository {
    async findAll() {
        return prisma_1.default.invoices.findMany({
            orderBy: { issue_date: 'desc' }
        });
    }
    async findById(id) {
        return prisma_1.default.invoices.findUnique({ where: { id } });
    }
    sanitizeData(data) {
        const { id, created_at, updated_at, createdAt, updatedAt, invoice_items, profiles, profile, vehicles, vehicle, client_name, client_id, vehicle_id, ...validData } = data;
        const sanitized = { ...validData };
        if (client_id) {
            sanitized.profiles = { connect: { id: client_id } };
        }
        if (vehicle_id) {
            sanitized.vehicles = { connect: { id: vehicle_id } };
        }
        return sanitized;
    }
    async create(data) {
        return prisma_1.default.invoices.create({ data: this.sanitizeData(data) });
    }
    async update(id, data) {
        return prisma_1.default.invoices.update({
            where: { id },
            data: this.sanitizeData(data)
        });
    }
    async delete(id) {
        await prisma_1.default.invoices.delete({ where: { id } });
    }
}
exports.PrismaInvoiceRepository = PrismaInvoiceRepository;
