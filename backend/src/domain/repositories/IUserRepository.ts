import { User } from '../models/User';
import { PaginatedResult, UserFilters } from '../../application/dtos/CommonDtos';

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findPaginated(filters: UserFilters): Promise<PaginatedResult<User>>;
  findById(id: string): Promise<User | null>;
  create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}
