"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../errors/AppError");
class JwtService {
    expiresIn = process.env.JWT_EXPIRES_IN || '2h';
    sign(payload) {
        const secret = this.getSecret();
        const options = { expiresIn: this.expiresIn };
        return jsonwebtoken_1.default.sign(payload, secret, options);
    }
    verify(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.getSecret());
            if (!this.isJwtUserPayload(decoded)) {
                throw new AppError_1.AppError(403, 'Invalid token payload');
            }
            return decoded;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new AppError_1.AppError(401, 'Token expired');
            }
            throw new AppError_1.AppError(403, 'Invalid token');
        }
    }
    getTokenExpiresIn() {
        return this.expiresIn;
    }
    getSecret() {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new AppError_1.AppError(500, 'JWT_SECRET is not configured');
        }
        return secret;
    }
    isJwtUserPayload(value) {
        return (Boolean(value) &&
            typeof value === 'object' &&
            typeof value.sub === 'string' &&
            typeof value.email === 'string' &&
            typeof value.role === 'string');
    }
}
exports.JwtService = JwtService;
