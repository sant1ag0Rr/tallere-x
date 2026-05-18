import { Router } from 'express';
import { InventoryController } from '../controllers/InventoryController';

const router = Router();
const controller = new InventoryController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
