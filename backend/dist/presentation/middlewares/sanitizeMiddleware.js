"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeMiddleware = void 0;
const sanitizeValue = (value) => {
    if (typeof value === 'string') {
        return value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
    }
    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }
    if (value && typeof value === 'object' && !(value instanceof Date)) {
        return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeValue(item)]));
    }
    return value;
};
const sanitizeMiddleware = (req, res, next) => {
    req.body = sanitizeValue(req.body);
    Object.defineProperty(req, 'query', {
        value: sanitizeValue(req.query),
        writable: true,
        configurable: true,
        enumerable: true
    });
    next();
};
exports.sanitizeMiddleware = sanitizeMiddleware;
