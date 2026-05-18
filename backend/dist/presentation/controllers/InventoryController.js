"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const InventoryUseCases_1 = require("../../application/useCases/InventoryUseCases");
const PrismaInventoryRepository_1 = require("../../infrastructure/repositories/PrismaInventoryRepository");
const caseTransform_1 = require("../utils/caseTransform");
class InventoryController {
    useCases;
    constructor() {
        const repository = new PrismaInventoryRepository_1.PrismaInventoryRepository();
        this.useCases = new InventoryUseCases_1.InventoryUseCases(repository);
    }
    getAll = async (req, res) => {
        try {
            const data = await this.useCases.getInventoryItems();
            res.status(200).json(data);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    getById = async (req, res) => {
        try {
            const data = await this.useCases.getInventoryItemById(req.params.id);
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
            const { name, sku, category, quantity, minQuantity, unitPrice, supplier } = req.body;
            const data = await this.useCases.createInventoryItem({
                name,
                sku,
                category: category || null,
                quantity: quantity ? parseInt(quantity) : 0,
                min_quantity: minQuantity ? parseInt(minQuantity) : 5,
                unit_price: unitPrice ? parseFloat(unitPrice) : null,
                supplier: supplier || null,
                last_restock_date: null
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
            const data = await this.useCases.updateInventoryItem(req.params.id, (0, caseTransform_1.toSnakeCaseObject)(req.body));
            res.status(200).json(data);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    delete = async (req, res) => {
        try {
            await this.useCases.deleteInventoryItem(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}
exports.InventoryController = InventoryController;
