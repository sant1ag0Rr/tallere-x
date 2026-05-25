"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUseCases = void 0;
class UserUseCases {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async getUsers() {
        return this.repository.findAll();
    }
    async getUsersPaginated(filters) {
        return this.repository.findPaginated(filters);
    }
    async getUserById(id) {
        return this.repository.findById(id);
    }
    async createUser(data) {
        return this.repository.create(data);
    }
    async updateUser(id, data) {
        return this.repository.update(id, data);
    }
    async deleteUser(id) {
        return this.repository.delete(id);
    }
}
exports.UserUseCases = UserUseCases;
