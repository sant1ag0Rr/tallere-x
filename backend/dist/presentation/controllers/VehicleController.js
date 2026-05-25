"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleController = void 0;
const VehicleUseCases_1 = require("../../application/useCases/VehicleUseCases");
const PrismaVehicleRepository_1 = require("../../infrastructure/repositories/PrismaVehicleRepository");
const caseTransform_1 = require("../utils/caseTransform");
class VehicleController {
    useCases;
    constructor() {
        const repository = new PrismaVehicleRepository_1.PrismaVehicleRepository();
        this.useCases = new VehicleUseCases_1.VehicleUseCases(repository);
    }
    getAll = async (req, res) => {
        const filters = req.query;
        const data = await this.useCases.getVehiclesPaginated({
            ...filters,
            clientId: req.user?.role === 'client' ? req.user.sub : filters.clientId
        });
        res.status(200).json({ success: true, ...data });
    };
    getById = async (req, res) => {
        const data = await this.useCases.getVehicleById(String(req.params.id));
        if (!data) {
            res.status(404).json({ success: false, message: 'Not found', details: [] });
            return;
        }
        if (req.user?.role === 'client' && data.assigned_client_id !== req.user.sub) {
            res.status(403).json({ success: false, message: 'Forbidden: resource does not belong to user', details: [] });
            return;
        }
        res.status(200).json({ success: true, data });
    };
    create = async (req, res) => {
        const { vin, plate, brand, model, year, mileage, status, assignedClientId } = req.body;
        const data = await this.useCases.createVehicle({
            vin: vin || null,
            plate,
            brand: brand || null,
            model: model || null,
            year: year ?? null,
            mileage: mileage ?? null,
            status: status || 'available',
            assigned_client_id: req.user?.role === 'client' ? req.user.sub : assignedClientId ?? null
        });
        res.status(201).json({ success: true, data });
    };
    update = async (req, res) => {
        const data = await this.useCases.updateVehicle(String(req.params.id), (0, caseTransform_1.toSnakeCaseObject)(req.body));
        res.status(200).json({ success: true, data });
    };
    delete = async (req, res) => {
        await this.useCases.deleteVehicle(String(req.params.id));
        res.status(204).send();
    };
}
exports.VehicleController = VehicleController;
