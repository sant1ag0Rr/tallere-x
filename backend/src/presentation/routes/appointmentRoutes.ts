import { Router } from 'express';
import { AppointmentController } from '../controllers/AppointmentController';
import { requireRole } from '../middlewares/authMiddleware';
import { asyncHandler } from '../middlewares/errorMiddleware';
import { validateBody, validateParams, validateQuery } from '../middlewares/validateRequest';
import { appointmentQuerySchema, createAppointmentBodySchema, idParamSchema, updateAppointmentBodySchema } from '../validation/schemas';

const router = Router();
const controller = new AppointmentController();

/**
 * @openapi
 * /appointments:
 *   get:
 *     summary: List appointments with filters and pagination
 */
router.get('/', requireRole(['admin', 'client']), validateQuery(appointmentQuerySchema), asyncHandler(controller.getAll));
router.get('/:id', validateParams(idParamSchema), requireRole(['admin', 'client']), asyncHandler(controller.getById));
router.post('/', requireRole(['admin', 'client']), validateBody(createAppointmentBodySchema), asyncHandler(controller.create));
router.put('/:id', validateParams(idParamSchema), requireRole(['admin', 'client']), validateBody(updateAppointmentBodySchema), asyncHandler(controller.update));
router.delete('/:id', validateParams(idParamSchema), requireRole(['admin']), asyncHandler(controller.delete));

export default router;
