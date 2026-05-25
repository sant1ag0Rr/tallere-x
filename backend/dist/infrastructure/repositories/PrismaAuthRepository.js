"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaAuthRepository = void 0;
const Auth_1 = require("../../domain/models/Auth");
const prisma_1 = __importDefault(require("../database/prisma"));
const normalizeRole = (role) => {
    if (role && Auth_1.USER_ROLES.includes(role)) {
        return role;
    }
    return 'client';
};
const toDate = (value) => {
    if (!value) {
        return null;
    }
    return value instanceof Date ? value : new Date(value);
};
const toAuthUser = (user) => ({
    id: user.id,
    email: user.email,
    role: normalizeRole(user.role),
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone ?? null,
    avatarUrl: user.avatar_url ?? null,
    isActive: user.is_active ?? true,
    createdAt: toDate(user.created_at),
    updatedAt: toDate(user.updated_at)
});
class PrismaAuthRepository {
    async findByEmail(email) {
        const user = await prisma_1.default.app_users.findUnique({ where: { email } });
        if (!user) {
            return null;
        }
        return {
            user: toAuthUser(user),
            passwordHash: user.password_hash
        };
    }
    async findById(id) {
        const user = await prisma_1.default.app_users.findUnique({ where: { id } });
        return user ? toAuthUser(user) : null;
    }
    async create(data) {
        const user = await prisma_1.default.app_users.create({
            data: {
                email: data.email,
                password_hash: data.passwordHash,
                role: data.role,
                first_name: data.firstName,
                last_name: data.lastName,
                phone: data.phone,
                avatar_url: data.avatarUrl,
                is_active: true
            }
        });
        return toAuthUser(user);
    }
}
exports.PrismaAuthRepository = PrismaAuthRepository;
