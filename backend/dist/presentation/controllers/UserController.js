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
        try {
            const users = await this.useCases.getUsers();
            res.status(200).json(users);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    getUserById = async (req, res) => {
        try {
            const user = await this.useCases.getUserById(req.params.id);
            if (user) {
                res.status(200).json(user);
            }
            else {
                res.status(404).json({ error: 'Not found' });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    createUser = async (req, res) => {
        try {
            const user = await this.useCases.createUser(req.body);
            res.status(201).json(user);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    updateUser = async (req, res) => {
        try {
            const user = await this.useCases.updateUser(req.params.id, (0, caseTransform_1.toSnakeCaseObject)(req.body));
            res.status(200).json(user);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    deleteUser = async (req, res) => {
        try {
            await this.useCases.deleteUser(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}
exports.UserController = UserController;
