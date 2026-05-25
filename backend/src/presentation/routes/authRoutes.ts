import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { asyncHandler } from '../middlewares/errorMiddleware';
import { validateBody } from '../middlewares/validateRequest';
import { loginBodySchema, registerBodySchema } from '../validation/schemas';

const router = Router();
const controller = new AuthController();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 */
router.post('/register', validateBody(registerBodySchema), asyncHandler(controller.register));
/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login and receive JWT token
 */
router.post('/login', validateBody(loginBodySchema), asyncHandler(controller.login));
router.get('/me', authMiddleware, asyncHandler(controller.me));

export default router;
