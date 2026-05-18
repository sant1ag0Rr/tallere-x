"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleUseCases = void 0;
class VehicleUseCases {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async getVehicles() {
        return this.repository.findAll();
    }
    async getVehicleById(id) {
        return this.repository.findById(id);
    }
    async createVehicle(data) {
        return this.repository.create(data);
    }
    async updateVehicle(id, data) {
        return this.repository.update(id, data);
    }
    async deleteVehicle(id) {
        return this.repository.delete(id);
    }
}
exports.VehicleUseCases = VehicleUseCases;
