"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const readDemoUser = (req) => {
    const rawUser = req.headers['x-tallerx-user'];
    const headerValue = Array.isArray(rawUser) ? rawUser[0] : rawUser;
    if (!headerValue || process.env.NODE_ENV === 'production') {
        return null;
    }
    try {
        return JSON.parse(headerValue);
    }
    catch {
        return null;
    }
};
const authMiddleware = (req, res, next) => {
    const demoUser = readDemoUser(req);
    if (demoUser) {
        req.user = demoUser;
        next();
        return;
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET is not defined in the environment variables');
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Attach user to request
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
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
