import { Router } from 'express';
import { FeedbackController } from '../controllers/FeedbackController';
import { requireRole } from '../middlewares/authMiddleware';

const router = Router();
const controller = new FeedbackController();

router.get('/', requireRole(['admin', 'client']), controller.getAll);
router.post('/', requireRole(['client']), controller.create);

export default router;
