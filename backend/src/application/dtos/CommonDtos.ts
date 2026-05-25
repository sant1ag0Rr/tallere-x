import { UserRole } from '../../domain/models/Auth';

export interface PaginationQuery {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserFilters extends PaginationQuery {
  search?: string;
  role?: UserRole;
}

export interface VehicleFilters extends PaginationQuery {
  status?: string;
  search?: string;
  plate?: string;
  clientId?: string;
}

export interface AppointmentFilters extends PaginationQuery {
  status?: string;
  clientId?: string;
  vehicleId?: string;
  from?: Date;
  to?: Date;
}

export const paginate = <T>(data: T[], page: number, limit: number, total: number): PaginatedResult<T> => ({
  data,
  meta: {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit))
  }
});
