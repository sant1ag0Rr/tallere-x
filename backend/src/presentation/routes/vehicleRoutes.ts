import { Router } from 'express';
import { VehicleController } from '../controllers/VehicleController';

const router = Router();
const controller = new VehicleController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
