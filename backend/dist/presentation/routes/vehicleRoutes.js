"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VehicleController_1 = require("../controllers/VehicleController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const errorMiddleware_1 = require("../middlewares/errorMiddleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const schemas_1 = require("../validation/schemas");
const router = (0, express_1.Router)();
const controller = new VehicleController_1.VehicleController();
/**
 * @openapi
 * /vehicles:
 *   get:
 *     summary: List vehicles with filters and pagination
 */
router.get('/', (0, authMiddleware_1.requireRole)(['admin', 'client', 'mechanic']), (0, validateRequest_1.validateQuery)(schemas_1.vehicleQuerySchema), (0, errorMiddleware_1.asyncHandler)(controller.getAll));
router.get('/:id', (0, validateRequest_1.validateParams)(schemas_1.idParamSchema), (0, authMiddleware_1.requireRole)(['admin', 'client', 'mechanic']), (0, errorMiddleware_1.asyncHandler)(controller.getById));
router.post('/', (0, authMiddleware_1.requireRole)(['admin', 'client']), (0, validateRequest_1.validateBody)(schemas_1.createVehicleBodySchema), (0, errorMiddleware_1.asyncHandler)(controller.create));
router.put('/:id', (0, validateRequest_1.validateParams)(schemas_1.idParamSchema), (0, authMiddleware_1.requireRole)(['admin']), (0, validateRequest_1.validateBody)(schemas_1.updateVehicleBodySchema), (0, errorMiddleware_1.asyncHandler)(controller.update));
router.delete('/:id', (0, validateRequest_1.validateParams)(schemas_1.idParamSchema), (0, authMiddleware_1.requireRole)(['admin']), (0, errorMiddleware_1.asyncHandler)(controller.delete));
exports.default = router;
