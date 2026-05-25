import { Router } from 'express';
import { VehicleController } from '../controllers/VehicleController';
import { requireRole } from '../middlewares/authMiddleware';
import { asyncHandler } from '../middlewares/errorMiddleware';
import { validateBody, validateParams, validateQuery } from '../middlewares/validateRequest';
import { createVehicleBodySchema, idParamSchema, updateVehicleBodySchema, vehicleQuerySchema } from '../validation/schemas';

const router = Router();
const controller = new VehicleController();

/**
 * @openapi
 * /vehicles:
 *   get:
 *     summary: List vehicles with filters and pagination
 */
router.get('/', requireRole(['admin', 'client', 'mechanic']), validateQuery(vehicleQuerySchema), asyncHandler(controller.getAll));
router.get('/:id', validateParams(idParamSchema), requireRole(['admin', 'client', 'mechanic']), asyncHandler(controller.getById));
router.post('/', requireRole(['admin', 'client']), validateBody(createVehicleBodySchema), asyncHandler(controller.create));
router.put('/:id', validateParams(idParamSchema), requireRole(['admin']), validateBody(updateVehicleBodySchema), asyncHandler(controller.update));
router.delete('/:id', validateParams(idParamSchema), requireRole(['admin']), asyncHandler(controller.delete));

export default router;
