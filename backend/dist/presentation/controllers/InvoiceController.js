"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceController = void 0;
const InvoiceUseCases_1 = require("../../application/useCases/InvoiceUseCases");
const PrismaInvoiceRepository_1 = require("../../infrastructure/repositories/PrismaInvoiceRepository");
const caseTransform_1 = require("../utils/caseTransform");
class InvoiceController {
    useCases;
    constructor() {
        const repository = new PrismaInvoiceRepository_1.PrismaInvoiceRepository();
        this.useCases = new InvoiceUseCases_1.InvoiceUseCases(repository);
    }
    getAll = async (req, res) => {
        try {
            const data = await this.useCases.getInvoices();
            res.status(200).json(data);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    getById = async (req, res) => {
        try {
            const data = await this.useCases.getInvoiceById(req.params.id);
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
            const { invoiceNumber, clientId, vehicleId, total, status, dueDate } = req.body;
            const data = await this.useCases.createInvoice({
                invoice_number: invoiceNumber,
                client_id: clientId || null,
                vehicle_id: vehicleId || null,
                total: total ? parseFloat(total) : 0,
                status: status || 'draft',
                issue_date: new Date(),
                due_date: dueDate ? new Date(dueDate) : null
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
            const data = await this.useCases.updateInvoice(req.params.id, (0, caseTransform_1.toSnakeCaseObject)(req.body));
            res.status(200).json(data);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    delete = async (req, res) => {
        try {
            await this.useCases.deleteInvoice(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}
exports.InvoiceController = InvoiceController;
