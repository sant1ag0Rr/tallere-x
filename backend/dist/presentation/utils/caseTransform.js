"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSnakeCaseObject = void 0;
const toSnakeCase = (key) => key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
const toSnakeCaseObject = (value) => {
    if (Array.isArray(value)) {
        return value.map((item) => (0, exports.toSnakeCaseObject)(item));
    }
    if (value && typeof value === 'object' && !(value instanceof Date)) {
        return Object.fromEntries(Object.entries(value)
            .filter(([key]) => !['id', 'createdAt', 'updatedAt'].includes(key))
            .map(([key, item]) => [toSnakeCase(key), (0, exports.toSnakeCaseObject)(item)]));
    }
    return value;
};
exports.toSnakeCaseObject = toSnakeCaseObject;
