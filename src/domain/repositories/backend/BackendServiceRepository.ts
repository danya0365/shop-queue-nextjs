import type { ServiceEntity, ServiceStatsEntity } from '@/src/domain/entities/backend/ServiceEntity';

export interface BackendServiceRepository {
  // Get paginated services with stats
  getServicesWithStats(
    page: number,
    limit: number,
    filters?: {
      searchQuery?: string;
      categoryFilter?: string;
      availabilityFilter?: string;
      shopId?: string;
    }
  ): Promise<{
    services: ServiceEntity[];
    stats: ServiceStatsEntity;
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>;

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

  // Update popularity rank
  updatePopularityRank(id: string, rank: number): Promise<boolean>;
}
