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
    async create(data) {
        return prisma_1.default.invoices.create({ data: data });
    }
    async update(id, data) {
        return prisma_1.default.invoices.update({
            where: { id },
            data: data
        });
    }
    async delete(id) {
        await prisma_1.default.invoices.delete({ where: { id } });
    }
}
exports.PrismaInvoiceRepository = PrismaInvoiceRepository;
