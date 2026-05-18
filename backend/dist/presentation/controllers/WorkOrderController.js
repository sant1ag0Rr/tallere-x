"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkOrderController = void 0;
const WorkOrderUseCases_1 = require("../../application/useCases/WorkOrderUseCases");
const PrismaWorkOrderRepository_1 = require("../../infrastructure/repositories/PrismaWorkOrderRepository");
const caseTransform_1 = require("../utils/caseTransform");
class WorkOrderController {
    useCases;
    constructor() {
        const repository = new PrismaWorkOrderRepository_1.PrismaWorkOrderRepository();
        this.useCases = new WorkOrderUseCases_1.WorkOrderUseCases(repository);
    }
    getAll = async (req, res) => {
        try {
            const data = await this.useCases.getWorkOrders();
            res.status(200).json(data);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    getById = async (req, res) => {
        try {
            const data = await this.useCases.getWorkOrderById(req.params.id);
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
            const { vehicleId, title, description, priority, reportedProblem, estimatedCost } = req.body;
            const data = await this.useCases.createWorkOrder({
                vehicle_id: vehicleId,
                title: title || null,
                description: description || null,
                status: 'pending',
                priority: priority || 'normal',
                reported_problem: reportedProblem || null,
                diagnosis: null,
                repairs: null,
                worked_minutes: 0,
                estimated_cost: estimatedCost ? parseFloat(estimatedCost) : null,
                actual_cost: null,
                completed_at: null
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
            const data = await this.useCases.updateWorkOrder(req.params.id, (0, caseTransform_1.toSnakeCaseObject)(req.body));
            res.status(200).json(data);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    delete = async (req, res) => {
        try {
            await this.useCases.deleteWorkOrder(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}
exports.WorkOrderController = WorkOrderController;
