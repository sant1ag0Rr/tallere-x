"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceUseCases = void 0;
class InvoiceUseCases {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async getInvoices() {
        return this.repository.findAll();
    }
    async getInvoiceById(id) {
        return this.repository.findById(id);
    }
    async createInvoice(data) {
        return this.repository.create(data);
    }
    async updateInvoice(id, data) {
        return this.repository.update(id, data);
    }
    async deleteInvoice(id) {
        return this.repository.delete(id);
    }
}
exports.InvoiceUseCases = InvoiceUseCases;
