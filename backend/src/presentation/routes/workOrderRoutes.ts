import { Router } from 'express';
import { WorkOrderController } from '../controllers/WorkOrderController';

const router = Router();
const controller = new WorkOrderController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
