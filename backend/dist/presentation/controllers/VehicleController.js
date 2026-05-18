"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleController = void 0;
const VehicleUseCases_1 = require("../../application/useCases/VehicleUseCases");
const PrismaVehicleRepository_1 = require("../../infrastructure/repositories/PrismaVehicleRepository");
const caseTransform_1 = require("../utils/caseTransform");
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
class VehicleController {
    useCases;
    constructor() {
        const repository = new PrismaVehicleRepository_1.PrismaVehicleRepository();
        this.useCases = new VehicleUseCases_1.VehicleUseCases(repository);
    }
    getAll = async (req, res) => {
        try {
            const data = await this.useCases.getVehicles();
            res.status(200).json(data);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    getById = async (req, res) => {
        try {
            const data = await this.useCases.getVehicleById(req.params.id);
            if (data) {
                res.status(200).json(data);
            }
            else {
                res.status(404).json({ error: 'Not found' });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    create = async (req, res) => {
        try {
            const { vin, plate, brand, model, year, mileage, status, assignedClientId } = req.body;
            const normalizedClientId = assignedClientId?.trim() || null;
            if (normalizedClientId && !UUID_REGEX.test(normalizedClientId)) {
                res.status(400).json({ error: 'assignedClientId must be a valid UUID' });
                return;
            }
            const data = await this.useCases.createVehicle({
                vin: vin || null,
                plate,
                brand: brand || null,
                model: model || null,
                year: year ? parseInt(year) : null,
                mileage: mileage ? parseInt(mileage) : null,
                status: status || 'available',
                assigned_client_id: normalizedClientId
            });
            res.status(201).json(data);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    update = async (req, res) => {
        try {
            const data = await this.useCases.updateVehicle(req.params.id, (0, caseTransform_1.toSnakeCaseObject)(req.body));
            res.status(200).json(data);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    delete = async (req, res) => {
        try {
            await this.useCases.deleteVehicle(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}
exports.VehicleController = VehicleController;
