"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthDtos_1 = require("../../application/dtos/AuthDtos");
const AuthUseCases_1 = require("../../application/useCases/AuthUseCases");
const PrismaAuthRepository_1 = require("../../infrastructure/repositories/PrismaAuthRepository");
const JwtService_1 = require("../../application/services/JwtService");
const PasswordHasher_1 = require("../../application/services/PasswordHasher");
class AuthController {
    useCases;
    constructor() {
        this.useCases = new AuthUseCases_1.AuthUseCases(new PrismaAuthRepository_1.PrismaAuthRepository(), new PasswordHasher_1.PasswordHasher(), new JwtService_1.JwtService());
    }
    register = async (req, res) => {
        const result = await this.useCases.register((0, AuthDtos_1.parseRegisterDto)(req.body));
        res.status(201).json(result);
    };
    login = async (req, res) => {
        const result = await this.useCases.login((0, AuthDtos_1.parseLoginDto)(req.body));
        res.status(200).json(result);
    };
    me = async (req, res) => {
        const userId = req.user?.sub;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const user = await this.useCases.getMe(userId);
        res.status(200).json({ user });
    };
}
exports.AuthController = AuthController;
