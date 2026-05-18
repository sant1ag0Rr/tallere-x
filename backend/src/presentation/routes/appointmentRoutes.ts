import { Router } from 'express';
import { AppointmentController } from '../controllers/AppointmentController';

const router = Router();
const controller = new AppointmentController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
