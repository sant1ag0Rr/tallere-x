import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { requireRole } from '../middlewares/authMiddleware';

const router = Router();
const controller = new UserController();

// Only admin can list all users or create new users
router.get('/', requireRole(['admin']), controller.getUsers);
router.post('/', requireRole(['admin']), controller.createUser);

// For simplicity, we assume users can view/edit themselves (in a real app, middleware would check id === req.user.id)
router.get('/:id', controller.getUserById);
router.put('/:id', controller.updateUser);

// Only admin can delete users
router.delete('/:id', requireRole(['admin']), controller.deleteUser);

export default router;
