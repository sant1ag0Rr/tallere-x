"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackController = void 0;
const FeedbackUseCases_1 = require("../../application/useCases/FeedbackUseCases");
const PrismaFeedbackRepository_1 = require("../../infrastructure/repositories/PrismaFeedbackRepository");
class FeedbackController {
    useCases;
    constructor() {
        const repository = new PrismaFeedbackRepository_1.PrismaFeedbackRepository();
        this.useCases = new FeedbackUseCases_1.FeedbackUseCases(repository);
    }
    getAll = async (req, res) => {
        try {
            const workOrderId = typeof req.query.workOrderId === 'string' ? req.query.workOrderId : undefined;
            const data = await this.useCases.getFeedback(workOrderId);
            res.status(200).json(data);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    create = async (req, res) => {
        try {
            const { clientId, workOrderId, rating, comment } = req.body;
            const data = await this.useCases.createFeedback({
                client_id: clientId || null,
                work_order_id: workOrderId || null,
                rating: rating ? Number(rating) : null,
                comment: comment || null
            });
            res.status(201).json(data);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}
exports.FeedbackController = FeedbackController;
