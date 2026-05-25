import { Router } from 'express';
import { InventoryController } from '../controllers/InventoryController';
import { requireRole } from '../middlewares/authMiddleware';

const router = Router();
const controller = new InventoryController();

router.get('/', requireRole(['admin', 'mechanic', 'seller']), controller.getAll);
router.get('/:id', requireRole(['admin', 'mechanic', 'seller']), controller.getById);
router.post('/', requireRole(['admin', 'seller']), controller.create);
router.put('/:id', requireRole(['admin', 'seller']), controller.update);
router.delete('/:id', requireRole(['admin']), controller.delete);

export default router;
