import type { ServiceEntity, ServiceStatsEntity, PaginatedServicesEntity } from '@/src/domain/entities/backend/service.entity';
import type { PaginationParams } from '@/src/domain/interfaces/pagination-types';

export enum BackendServiceErrorType {
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DUPLICATE_ERROR = 'DUPLICATE_ERROR',
  UNKNOWN = 'UNKNOWN'
}

export class BackendServiceError extends Error {
  constructor(
    public readonly type: BackendServiceErrorType,
    message: string,
    public readonly operation: string,
    public readonly context: Record<string, unknown> = {},
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'BackendServiceError';
  }
}

export interface BackendServiceRepository {
  // Get paginated services
  getPaginatedServices(params: PaginationParams & {
    filters?: {
      searchQuery?: string;
      categoryFilter?: string;
      availabilityFilter?: string;
      shopId?: string;
    }
  }): Promise<PaginatedServicesEntity>;

  // Get service statistics
  getServiceStats(): Promise<ServiceStatsEntity>;

  // Get single service by ID
  getServiceById(id: string): Promise<ServiceEntity | null>;

  // Create new service
  createService(service: Omit<ServiceEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceEntity>;

  // Update service
  updateService(id: string, updates: Partial<ServiceEntity>): Promise<ServiceEntity>;

  // Delete service
  deleteService(id: string): Promise<boolean>;

  // Toggle service availability
  toggleAvailability(id: string, isAvailable: boolean): Promise<boolean>;
}
