"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkOrderUseCases = void 0;
class WorkOrderUseCases {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async getWorkOrders() {
        return this.repository.findAll();
    }
    async getWorkOrderById(id) {
        return this.repository.findById(id);
    }
    async createWorkOrder(data) {
        return this.repository.create(data);
    }
    async updateWorkOrder(id, data) {
        return this.repository.update(id, data);
    }
    async deleteWorkOrder(id) {
        return this.repository.delete(id);
    }
}
exports.WorkOrderUseCases = WorkOrderUseCases;
