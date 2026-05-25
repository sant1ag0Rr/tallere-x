"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentUseCases = void 0;
class AppointmentUseCases {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async getAppointments() {
        return this.repository.findAll();
    }
    async getAppointmentsPaginated(filters) {
        return this.repository.findPaginated(filters);
    }
    async getAppointmentById(id) {
        return this.repository.findById(id);
    }
    async getClientAppointments(clientId) {
        return this.repository.findByClientId(clientId);
    }
    async createAppointment(data) {
        return this.repository.create(data);
    }
    async updateAppointment(id, data) {
        return this.repository.update(id, data);
    }
    async deleteAppointment(id) {
        return this.repository.delete(id);
    }
}
exports.AppointmentUseCases = AppointmentUseCases;
