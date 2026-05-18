"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const prisma_1 = __importDefault(require("../database/prisma"));
class PrismaUserRepository {
    async findAll() {
        return prisma_1.default.profiles.findMany();
    }
    async findById(id) {
        return prisma_1.default.profiles.findUnique({ where: { id } });
    }
    async create(data) {
        return prisma_1.default.profiles.create({ data: data });
    }
    async update(id, data) {
        return prisma_1.default.profiles.update({ where: { id }, data: data });
    }
    async delete(id) {
        await prisma_1.default.profiles.delete({ where: { id } });
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
