"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryUseCases = void 0;
class InventoryUseCases {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async getInventoryItems() {
        return this.repository.findAll();
    }
    async getInventoryItemById(id) {
        return this.repository.findById(id);
    }
    async createInventoryItem(data) {
        return this.repository.create(data);
    }
    async updateInventoryItem(id, data) {
        return this.repository.update(id, data);
    }
    async deleteInventoryItem(id) {
        return this.repository.delete(id);
    }
}
exports.InventoryUseCases = InventoryUseCases;
