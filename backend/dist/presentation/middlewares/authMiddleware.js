"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSelfOrRole = exports.requireRole = exports.authMiddleware = void 0;
const JwtService_1 = require("../../application/services/JwtService");
const AppError_1 = require("../../application/errors/AppError");
const jwtService = new JwtService_1.JwtService();
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        req.user = jwtService.verify(token);
        next();
    }
    catch (error) {
        if (error instanceof AppError_1.AppError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(403).json({ error: 'Invalid token' });
        return;
    }
};
exports.authMiddleware = authMiddleware;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
const requireSelfOrRole = (roles, paramName = 'id') => {
    return (req, res, next) => {
        const requestedUserId = req.params[paramName];
        const isSelf = Boolean(req.user?.sub && requestedUserId && req.user.sub === requestedUserId);
        const hasRole = Boolean(req.user?.role && roles.includes(req.user.role));
        if (!isSelf && !hasRole) {
            res.status(403).json({ error: 'Forbidden: You can only access your own resource' });
            return;
        }
        next();
    };
};
exports.requireSelfOrRole = requireSelfOrRole;
