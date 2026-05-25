"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = exports.validateParams = exports.validateBody = void 0;
const validate = (key, schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req[key]);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                details: result.error.issues.map((issue) => ({
                    path: issue.path.join('.'),
                    message: issue.message
                }))
            });
            return;
        }
        Object.defineProperty(req, key, {
            value: result.data,
            writable: true,
            configurable: true,
            enumerable: true
        });
        next();
    };
};
const validateBody = (schema) => validate('body', schema);
exports.validateBody = validateBody;
const validateParams = (schema) => validate('params', schema);
exports.validateParams = validateParams;
const validateQuery = (schema) => validate('query', schema);
exports.validateQuery = validateQuery;
