"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaAuthRepository = void 0;
const Auth_1 = require("../../domain/models/Auth");
const prisma_1 = __importDefault(require("../database/prisma"));
const crypto = __importStar(require("crypto"));
const normalizeRole = (role) => {
    if (role && Auth_1.USER_ROLES.includes(role)) {
        return role;
    }
    return 'client';
};
const toAuthUser = (user) => {
    const p = user.profiles;
    return {
        id: user.id,
        email: user.email || p?.email || '',
        role: normalizeRole(p?.role),
        firstName: p?.first_name || '',
        lastName: p?.last_name || '',
        phone: p?.phone || null,
        avatarUrl: p?.avatar_url || null,
        isActive: p?.is_active ?? true,
        createdAt: p?.created_at || new Date(),
        updatedAt: p?.updated_at || new Date()
    };
};
class PrismaAuthRepository {
    async findByEmail(email) {
        const user = await prisma_1.default.users.findFirst({
            where: { email },
            include: { profiles: true }
        });
        if (!user) {
            return null;
        }
        return {
            user: toAuthUser(user),
            passwordHash: user.encrypted_password || ''
        };
    }
    async findById(id) {
        const user = await prisma_1.default.users.findUnique({
            where: { id },
            include: { profiles: true }
        });
        return user ? toAuthUser(user) : null;
    }
    async create(data) {
        const id = crypto.randomUUID();
        const user = await prisma_1.default.users.create({
            data: {
                id,
                email: data.email,
                encrypted_password: data.passwordHash,
                aud: 'authenticated',
                role: 'authenticated',
                profiles: {
                    create: {
                        email: data.email,
                        role: data.role,
                        first_name: data.firstName,
                        last_name: data.lastName,
                        phone: data.phone,
                        avatar_url: data.avatarUrl,
                        is_active: true
                    }
                }
            },
            include: { profiles: true }
        });
        return toAuthUser(user);
    }
}
exports.PrismaAuthRepository = PrismaAuthRepository;
