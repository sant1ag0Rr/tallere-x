"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const crypto_1 = require("crypto");
const CommonDtos_1 = require("../../application/dtos/CommonDtos");
const prisma_1 = __importDefault(require("../database/prisma"));
const toUser = (profile) => ({
    id: profile.id,
    email: profile.email ?? '',
    role: profile.role ?? 'client',
    isActive: profile.is_active ?? true,
    firstName: profile.first_name ?? '',
    lastName: profile.last_name ?? '',
    phone: profile.phone ?? null,
    avatarUrl: profile.avatar_url ?? null,
    createdAt: profile.created_at ?? new Date(0),
    updatedAt: profile.updated_at ?? new Date(0)
});
class PrismaUserRepository {
    async findAll() {
        const profiles = await prisma_1.default.profiles.findMany();
        return profiles.map(toUser);
    }
    async findPaginated(filters) {
        const where = {
            ...(filters.search
                ? {
                    OR: [
                        { email: { contains: filters.search, mode: 'insensitive' } },
                        { first_name: { contains: filters.search, mode: 'insensitive' } },
                        { last_name: { contains: filters.search, mode: 'insensitive' } }
                    ]
                }
                : {}),
            ...(filters.role ? { role: filters.role } : {})
        };
        const [data, total] = await prisma_1.default.$transaction([
            prisma_1.default.profiles.findMany({
                where,
                skip: (filters.page - 1) * filters.limit,
                take: filters.limit,
                orderBy: { created_at: 'desc' }
            }),
            prisma_1.default.profiles.count({ where })
        ]);
        return (0, CommonDtos_1.paginate)(data.map(toUser), filters.page, filters.limit, total);
    }
    async findById(id) {
        const profile = await prisma_1.default.profiles.findUnique({ where: { id } });
        return profile ? toUser(profile) : null;
    }
    async create(data) {
        const profile = await prisma_1.default.profiles.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                email: data.email,
                role: data.role,
                is_active: data.isActive,
                first_name: data.firstName,
                last_name: data.lastName,
                phone: data.phone,
                avatar_url: data.avatarUrl
            }
        });
        return toUser(profile);
    }
    async update(id, data) {
        const profile = await prisma_1.default.profiles.update({
            where: { id },
            data: {
                email: data.email,
                role: data.role,
                is_active: data.isActive,
                first_name: data.firstName,
                last_name: data.lastName,
                phone: data.phone,
                avatar_url: data.avatarUrl
            }
        });
        return toUser(profile);
    }
    async delete(id) {
        await prisma_1.default.profiles.delete({ where: { id } });
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
