"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
const controller = new UserController_1.UserController();
// Only admin can list all users or create new users
router.get('/', (0, authMiddleware_1.requireRole)(['admin']), controller.getUsers);
router.post('/', (0, authMiddleware_1.requireRole)(['admin']), controller.createUser);
// For simplicity, we assume users can view/edit themselves (in a real app, middleware would check id === req.user.id)
router.get('/:id', controller.getUserById);
router.put('/:id', controller.updateUser);
// Only admin can delete users
router.delete('/:id', (0, authMiddleware_1.requireRole)(['admin']), controller.deleteUser);
exports.default = router;
