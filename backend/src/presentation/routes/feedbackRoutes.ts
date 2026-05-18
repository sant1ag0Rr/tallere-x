import { Router } from 'express';
import { FeedbackController } from '../controllers/FeedbackController';

const router = Router();
const controller = new FeedbackController();

router.get('/', controller.getAll);
router.post('/', controller.create);

export default router;
