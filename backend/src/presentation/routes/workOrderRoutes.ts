import { Router } from 'express';
import { WorkOrderController } from '../controllers/WorkOrderController';
import { requireRole } from '../middlewares/authMiddleware';

const router = Router();
const controller = new WorkOrderController();

router.get('/', requireRole(['admin', 'mechanic', 'client']), controller.getAll);
router.get('/:id', requireRole(['admin', 'mechanic', 'client']), controller.getById);
router.post('/', requireRole(['admin']), controller.create);
router.put('/:id', requireRole(['admin', 'mechanic']), controller.update);
router.delete('/:id', requireRole(['admin']), controller.delete);

export default router;
