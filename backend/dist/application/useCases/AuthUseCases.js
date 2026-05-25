"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUseCases = void 0;
const AppError_1 = require("../errors/AppError");
class AuthUseCases {
    authRepository;
    passwordHasher;
    jwtService;
    constructor(authRepository, passwordHasher, jwtService) {
        this.authRepository = authRepository;
        this.passwordHasher = passwordHasher;
        this.jwtService = jwtService;
    }
    async register(data) {
        const existingUser = await this.authRepository.findByEmail(data.email);
        if (existingUser) {
            throw new AppError_1.AppError(409, 'Email is already registered');
        }
        const passwordHash = await this.passwordHasher.hash(data.password);
        const user = await this.authRepository.create({
            email: data.email,
            passwordHash,
            role: data.role,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone ?? null,
            avatarUrl: data.avatarUrl ?? null
        });
        return this.createAuthResult(user);
    }
    async login(data) {
        const authUser = await this.authRepository.findByEmail(data.email);
        if (!authUser || !authUser.passwordHash) {
            throw new AppError_1.AppError(401, 'Invalid email or password');
        }
        if (!authUser.user.isActive) {
            throw new AppError_1.AppError(403, 'User account is inactive');
        }
        const isValidPassword = await this.passwordHasher.compare(data.password, authUser.passwordHash);
        if (!isValidPassword) {
            throw new AppError_1.AppError(401, 'Invalid email or password');
        }
        return this.createAuthResult(authUser.user);
    }
    async getMe(userId) {
        const user = await this.authRepository.findById(userId);
        if (!user) {
            throw new AppError_1.AppError(404, 'Authenticated user was not found');
        }
        return user;
    }
    createAuthResult(user) {
        return {
            user,
            token: this.jwtService.sign({
                sub: user.id,
                email: user.email,
                role: user.role
            }),
            expiresIn: this.jwtService.getTokenExpiresIn()
        };
    }
}
exports.AuthUseCases = AuthUseCases;
