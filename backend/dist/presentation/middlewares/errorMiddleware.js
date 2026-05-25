"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = exports.notFoundMiddleware = exports.asyncHandler = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../../application/errors/AppError");
const asyncHandler = (handler) => (req, res, next) => {
    handler(req, res, next).catch(next);
};
exports.asyncHandler = asyncHandler;
const notFoundMiddleware = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} was not found`,
        details: []
    });
};
exports.notFoundMiddleware = notFoundMiddleware;
const errorMiddleware = (error, req, res, next) => {
    if (res.headersSent) {
        next(error);
        return;
    }
    if (error instanceof AppError_1.AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
            details: error.details
        });
        return;
    }
    if (error instanceof zod_1.ZodError) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            details: error.issues.map((issue) => ({
                path: issue.path.join('.'),
                message: issue.message
            }))
        });
        return;
    }
    if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
        res.status(401).json({ success: false, message: 'Token expired', details: [] });
        return;
    }
    if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
        res.status(403).json({ success: false, message: 'Invalid token', details: [] });
        return;
    }
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            res.status(409).json({
                success: false,
                message: 'A record with this unique value already exists',
                details: [error.meta ?? {}]
            });
            return;
        }
        if (error.code === 'P2025') {
            res.status(404).json({ success: false, message: 'Record not found', details: [] });
            return;
        }
        if (error.code === 'P2021' || error.code === 'EACCES') {
            res.status(503).json({
                success: false,
                message: 'Database schema or permissions are not ready',
                details: [{ code: error.code, meta: error.meta }]
            });
            return;
        }
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error', details: [] });
};
exports.errorMiddleware = errorMiddleware;
