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
        const filters = req.query;
        const data = await this.useCases.getAppointmentsPaginated({
            ...filters,
            clientId: req.user?.role === 'client' ? req.user.sub : filters.clientId
        });
        res.status(200).json({ success: true, ...data });
    };
    getById = async (req, res) => {
        const data = await this.useCases.getAppointmentById(String(req.params.id));
        if (!data) {
            res.status(404).json({ success: false, message: 'Not found', details: [] });
            return;
        }
        if (req.user?.role === 'client' && data.client_id !== req.user.sub) {
            res.status(403).json({ success: false, message: 'Forbidden: resource does not belong to user', details: [] });
            return;
        }
        res.status(200).json({ success: true, data });
    };
    create = async (req, res) => {
        const { clientId, vehicleId, serviceType, date, time, notes } = req.body;
        const data = await this.useCases.createAppointment({
            client_id: req.user?.role === 'client' ? req.user.sub : clientId,
            vehicle_id: vehicleId,
            service_type: serviceType,
            date,
            time: new Date(`${date.toISOString().slice(0, 10)}T${time}:00Z`),
            status: 'scheduled',
            notes: notes || null
        });
        res.status(201).json({ success: true, data });
    };
    update = async (req, res) => {
        const current = await this.useCases.getAppointmentById(String(req.params.id));
        if (req.user?.role === 'client' && current?.client_id !== req.user.sub) {
            res.status(403).json({ success: false, message: 'Forbidden: resource does not belong to user', details: [] });
            return;
        }
        const data = await this.useCases.updateAppointment(String(req.params.id), (0, caseTransform_1.toSnakeCaseObject)(req.body));
        res.status(200).json({ success: true, data });
    };
    delete = async (req, res) => {
        await this.useCases.deleteAppointment(String(req.params.id));
        res.status(204).send();
    };
}
exports.AppointmentController = AppointmentController;
