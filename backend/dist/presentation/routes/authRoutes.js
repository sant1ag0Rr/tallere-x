"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const errorMiddleware_1 = require("../middlewares/errorMiddleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const schemas_1 = require("../validation/schemas");
const router = (0, express_1.Router)();
const controller = new AuthController_1.AuthController();
/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 */
router.post('/register', (0, validateRequest_1.validateBody)(schemas_1.registerBodySchema), (0, errorMiddleware_1.asyncHandler)(controller.register));
/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login and receive JWT token
 */
router.post('/login', (0, validateRequest_1.validateBody)(schemas_1.loginBodySchema), (0, errorMiddleware_1.asyncHandler)(controller.login));
router.get('/me', authMiddleware_1.authMiddleware, (0, errorMiddleware_1.asyncHandler)(controller.me));
exports.default = router;
