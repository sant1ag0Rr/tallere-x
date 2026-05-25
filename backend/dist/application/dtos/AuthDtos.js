"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLoginDto = exports.parseRegisterDto = void 0;
const Auth_1 = require("../../domain/models/Auth");
const AppError_1 = require("../errors/AppError");
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isRecord = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const readString = (body, key) => {
    const value = body[key];
    return typeof value === 'string' ? value.trim() : undefined;
};
const parseRole = (value) => {
    if (typeof value === 'string' && Auth_1.USER_ROLES.includes(value)) {
        return value;
    }
    throw new AppError_1.AppError(400, 'Role must be one of: admin, client, mechanic, seller');
};
const parseRegisterDto = (body) => {
    if (!isRecord(body)) {
        throw new AppError_1.AppError(400, 'Request body must be a JSON object');
    }
    const email = readString(body, 'email')?.toLowerCase();
    const password = readString(body, 'password');
    const firstName = readString(body, 'firstName');
    const lastName = readString(body, 'lastName');
    if (!email || !EMAIL_REGEX.test(email)) {
        throw new AppError_1.AppError(400, 'A valid email is required');
    }
    if (!password || password.length < 8) {
        throw new AppError_1.AppError(400, 'Password must have at least 8 characters');
    }
    if (!firstName || !lastName) {
        throw new AppError_1.AppError(400, 'firstName and lastName are required');
    }
    return {
        email,
        password,
        role: parseRole(body.role),
        firstName,
        lastName,
        phone: readString(body, 'phone') ?? null,
        avatarUrl: readString(body, 'avatarUrl') ?? null
    };
};
exports.parseRegisterDto = parseRegisterDto;
const parseLoginDto = (body) => {
    if (!isRecord(body)) {
        throw new AppError_1.AppError(400, 'Request body must be a JSON object');
    }
    const email = readString(body, 'email')?.toLowerCase();
    const password = readString(body, 'password');
    if (!email || !EMAIL_REGEX.test(email) || !password) {
        throw new AppError_1.AppError(400, 'Email and password are required');
    }
    return { email, password };
};
exports.parseLoginDto = parseLoginDto;
