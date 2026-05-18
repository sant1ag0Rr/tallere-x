"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackUseCases = void 0;
class FeedbackUseCases {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async getFeedback(workOrderId) {
        return this.repository.findAll(workOrderId);
    }
    async createFeedback(data) {
        return this.repository.create(data);
    }
}
exports.FeedbackUseCases = FeedbackUseCases;
