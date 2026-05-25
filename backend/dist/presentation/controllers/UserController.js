"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserUseCases_1 = require("../../application/useCases/UserUseCases");
const PrismaUserRepository_1 = require("../../infrastructure/repositories/PrismaUserRepository");
const caseTransform_1 = require("../utils/caseTransform");
class UserController {
    useCases;
    constructor() {
        const userRepository = new PrismaUserRepository_1.PrismaUserRepository();
        this.useCases = new UserUseCases_1.UserUseCases(userRepository);
    }
    getUsers = async (req, res) => {
        const users = await this.useCases.getUsersPaginated(req.query);
        res.status(200).json({ success: true, ...users });
    };
    getUserById = async (req, res) => {
        const user = await this.useCases.getUserById(String(req.params.id));
        if (user) {
            res.status(200).json({ success: true, data: user });
        }
        else {
            res.status(404).json({ success: false, message: 'Not found', details: [] });
        }
    };
    createUser = async (req, res) => {
        const user = await this.useCases.createUser(req.body);
        res.status(201).json({ success: true, data: user });
    };
    updateUser = async (req, res) => {
        const user = await this.useCases.updateUser(String(req.params.id), (0, caseTransform_1.toSnakeCaseObject)(req.body));
        res.status(200).json({ success: true, data: user });
    };
    deleteUser = async (req, res) => {
        await this.useCases.deleteUser(String(req.params.id));
        res.status(204).send();
    };
}
exports.UserController = UserController;
