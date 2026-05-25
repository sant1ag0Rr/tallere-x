import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { requireRole, requireSelfOrRole } from '../middlewares/authMiddleware';
import { asyncHandler } from '../middlewares/errorMiddleware';
import { validateParams, validateQuery } from '../middlewares/validateRequest';
import { idParamSchema, userQuerySchema } from '../validation/schemas';

const router = Router();
const controller = new UserController();

// Only admin can list all users or create new users
/**
 * @openapi
 * /users:
 *   get:
 *     summary: List users with pagination
 */
router.get('/', requireRole(['admin']), validateQuery(userQuerySchema), asyncHandler(controller.getUsers));
router.post('/', requireRole(['admin']), asyncHandler(controller.createUser));

router.get('/:id', validateParams(idParamSchema), requireSelfOrRole(['admin']), asyncHandler(controller.getUserById));
router.put('/:id', validateParams(idParamSchema), requireSelfOrRole(['admin']), asyncHandler(controller.updateUser));

// Only admin can delete users
router.delete('/:id', validateParams(idParamSchema), requireRole(['admin']), asyncHandler(controller.deleteUser));

export default router;
