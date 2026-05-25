"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const errorMiddleware_1 = require("../middlewares/errorMiddleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const schemas_1 = require("../validation/schemas");
const router = (0, express_1.Router)();
const controller = new UserController_1.UserController();
// Only admin can list all users or create new users
/**
 * @openapi
 * /users:
 *   get:
 *     summary: List users with pagination
 */
router.get('/', (0, authMiddleware_1.requireRole)(['admin']), (0, validateRequest_1.validateQuery)(schemas_1.userQuerySchema), (0, errorMiddleware_1.asyncHandler)(controller.getUsers));
router.post('/', (0, authMiddleware_1.requireRole)(['admin']), (0, errorMiddleware_1.asyncHandler)(controller.createUser));
router.get('/:id', (0, validateRequest_1.validateParams)(schemas_1.idParamSchema), (0, authMiddleware_1.requireSelfOrRole)(['admin']), (0, errorMiddleware_1.asyncHandler)(controller.getUserById));
router.put('/:id', (0, validateRequest_1.validateParams)(schemas_1.idParamSchema), (0, authMiddleware_1.requireSelfOrRole)(['admin']), (0, errorMiddleware_1.asyncHandler)(controller.updateUser));
// Only admin can delete users
router.delete('/:id', (0, validateRequest_1.validateParams)(schemas_1.idParamSchema), (0, authMiddleware_1.requireRole)(['admin']), (0, errorMiddleware_1.asyncHandler)(controller.deleteUser));
exports.default = router;
