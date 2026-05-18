"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const AppointmentUseCases_1 = require("../../application/useCases/AppointmentUseCases");
const PrismaAppointmentRepository_1 = require("../../infrastructure/repositories/PrismaAppointmentRepository");
const caseTransform_1 = require("../utils/caseTransform");
class AppointmentController {
    useCases;
    constructor() {
        const repository = new PrismaAppointmentRepository_1.PrismaAppointmentRepository();
        this.useCases = new AppointmentUseCases_1.AppointmentUseCases(repository);
    }
    getAll = async (req, res) => {
        try {
            const data = await this.useCases.getAppointments();
            res.status(200).json(data);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    getById = async (req, res) => {
        try {
            const data = await this.useCases.getAppointmentById(req.params.id);
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
            const { clientId, vehicleId, serviceType, date, time, notes } = req.body;
            const data = await this.useCases.createAppointment({
                client_id: clientId,
                vehicle_id: vehicleId,
                service_type: serviceType,
                date: new Date(date),
                time: new Date(`${date}T${time}:00Z`),
                status: 'scheduled',
                notes: notes || null
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
            const data = await this.useCases.updateAppointment(req.params.id, (0, caseTransform_1.toSnakeCaseObject)(req.body));
            res.status(200).json(data);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    delete = async (req, res) => {
        try {
            await this.useCases.deleteAppointment(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}
exports.AppointmentController = AppointmentController;
