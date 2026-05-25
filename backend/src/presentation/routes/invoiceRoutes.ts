import { Router } from 'express';
import { InvoiceController } from '../controllers/InvoiceController';
import { requireRole } from '../middlewares/authMiddleware';

const router = Router();
const controller = new InvoiceController();

router.get('/', requireRole(['admin', 'seller']), controller.getAll);
router.get('/:id', requireRole(['admin', 'seller']), controller.getById);
router.post('/', requireRole(['admin', 'seller']), controller.create);
router.put('/:id', requireRole(['admin', 'seller']), controller.update);
router.delete('/:id', requireRole(['admin']), controller.delete);

export default router;
