import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/models/User';
import { PaginatedResult, UserFilters } from '../dtos/CommonDtos';

export class UserUseCases {
  constructor(private repository: IUserRepository) {}

  async getUsers(): Promise<User[]> {
    return this.repository.findAll();
  }

  async getUsersPaginated(filters: UserFilters): Promise<PaginatedResult<User>> {
    return this.repository.findPaginated(filters);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.repository.findById(id);
  }

  async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.repository.create(data);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.repository.update(id, data);
  }

  async deleteUser(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
