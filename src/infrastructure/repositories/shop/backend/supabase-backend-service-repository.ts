import {
  PaginatedServicesEntity,
  ServiceEntity,
  ServiceStatsEntity,
} from "@/src/domain/entities/shop/backend/backend-service.entity";
import {
  DatabaseDataSource,
  FilterOperator,
  QueryOptions,
  SortDirection,
} from "@/src/domain/interfaces/datasources/database-datasource";
import { Logger } from "@/src/domain/interfaces/logger";
import { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import {
  ShopBackendServiceError,
  ShopBackendServiceErrorType,
  ShopBackendServiceRepository,
} from "@/src/domain/repositories/shop/backend/backend-service-repository";
import { SupabaseShopBackendServiceMapper } from "@/src/infrastructure/mappers/shop/backend/supabase-backend-service.mapper";
import {
  ServiceSchemaType,
  ServiceStatsSchemaType,
} from "@/src/infrastructure/schemas/shop/backend/service.schema";
import { StandardRepository } from "../../base/standard-repository";

// Extended types for joined data
type ServiceWithJoinedData = ServiceSchemaType & {
  shops?: { name?: string };
  categories?: { name?: string };
};
type ServiceSchemaRecord = Record<string, unknown> & ServiceSchemaType;
type ServiceStatsSchemaRecord = Record<string, unknown> &
  ServiceStatsSchemaType;

/**
 * Supabase implementation of the service repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseShopBackendServiceRepository
  extends StandardRepository
  implements ShopBackendServiceRepository
{
  constructor(dataSource: DatabaseDataSource, logger: Logger) {
    super(dataSource, logger, "ShopBackendService");
  }

  /**
   * Get paginated services data from database
   * @param params Pagination parameters with filters
   * @returns Paginated services data
   */
  async getPaginatedServices(
    params: PaginationParams & {
      filters?: {
        searchQuery?: string;
        categoryFilter?: string;
        availabilityFilter?: string;
        shopId?: string;
      };
    }
  ): Promise<PaginatedServicesEntity> {
    try {
      const { page, limit, filters } = params;
      const offset = (page - 1) * limit;

      // Build query options
      const queryOptions: QueryOptions = {
        select: ["*"],
        joins: [
          {
            table: "shops",
            on: { fromField: "shop_id", toField: "id" },
            select: ["name"],
          },
        ],
        sort: [{ field: "created_at", direction: SortDirection.DESC }],
        pagination: {
          limit,
          offset,
        },
        filters: [],
      };

      // Apply filters
      if (filters?.searchQuery) {
        queryOptions.filters?.push({
          field: "name",
          operator: FilterOperator.ILIKE,
          value: `%${filters.searchQuery}%`,
        });
      }

      if (filters?.categoryFilter) {
        queryOptions.filters?.push({
          field: "category",
          operator: FilterOperator.EQ,
          value: filters.categoryFilter,
        });
      }

      if (filters?.availabilityFilter) {
        const isAvailable = filters.availabilityFilter === "available";
        queryOptions.filters?.push({
          field: "is_available",
          operator: FilterOperator.EQ,
          value: isAvailable,
        });
      }

      if (filters?.shopId) {
        queryOptions.filters?.push({
          field: "shop_id",
          operator: FilterOperator.EQ,
          value: filters.shopId,
        });
      }

      // Use extended type that satisfies Record<string, unknown> constraint
      const services = await this.dataSource.getAdvanced<ServiceSchemaRecord>(
        "services",
        queryOptions
      );

      // Count total items
      const totalItems = await this.dataSource.count("services", {
        filters: queryOptions.filters,
      });

      // Map database results to domain entities
      const mappedServices = services.map((service) => {
        // Handle joined data from shops table
        const serviceWithJoinedData = service as ServiceWithJoinedData;

        const serviceWithShopName = {
          ...service,
          shop_name: serviceWithJoinedData.shops?.name,
        };

        return SupabaseShopBackendServiceMapper.toDomain(serviceWithShopName);
      });

      // Create pagination metadata
      const pagination = SupabaseShopBackendServiceMapper.createPaginationMeta(
        page,
        limit,
        totalItems
      );

      return {
        data: mappedServices,
        pagination,
      };
    } catch (error) {
      if (error instanceof ShopBackendServiceError) {
        throw error;
      }

      this.logger.error("Error in getPaginatedServices", { error });
      throw new ShopBackendServiceError(
        ShopBackendServiceErrorType.UNKNOWN,
        "An unexpected error occurred while fetching services",
        "getPaginatedServices",
        {},
        error
      );
    }
  }

  /**
   * Get service by ID
   * @param id Service ID
   * @returns Service entity or null if not found
   */
  async getServiceById(id: string): Promise<ServiceEntity | null> {
    try {
      // Use getById which is designed for fetching by ID
      const service = await this.dataSource.getById<ServiceSchemaRecord>(
        "services",
        id,
        {
          select: ["*"],
          joins: [
            {
              table: "shops",
              on: { fromField: "shop_id", toField: "id" },
              select: ["name"],
            },
          ],
        }
      );

      if (!service) {
        return null;
      }

      // Handle joined data from shops table
      const serviceWithJoinedData = service as ServiceWithJoinedData;

      const serviceWithShopName = {
        ...service,
        shop_name: serviceWithJoinedData.shops?.name,
      };

      // Map database result to domain entity
      return SupabaseShopBackendServiceMapper.toDomain(serviceWithShopName);
    } catch (error) {
      if (error instanceof ShopBackendServiceError) {
        throw error;
      }

      this.logger.error("Error in getServiceById", { error, id });
      throw new ShopBackendServiceError(
        ShopBackendServiceErrorType.UNKNOWN,
        "An unexpected error occurred while fetching service",
        "getServiceById",
        { id },
        error
      );
    }
  }

  /**
   * Create new service
   * @param service Service data without id, createdAt, updatedAt
   * @returns Created service entity
   */
  async createService(
    service: Omit<ServiceEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<ServiceEntity> {
    try {
      const serviceData = SupabaseShopBackendServiceMapper.toDatabase({
        ...service,
        id: "", // Will be generated by database
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const createdService = await this.dataSource.insert<ServiceSchemaRecord>(
        "services",
        serviceData
      );
      return SupabaseShopBackendServiceMapper.toDomain(createdService);
    } catch (error) {
      if (error instanceof ShopBackendServiceError) {
        throw error;
      }

      this.logger.error("Error in createService", { error, service });
      throw new ShopBackendServiceError(
        ShopBackendServiceErrorType.UNKNOWN,
        "An unexpected error occurred while creating service",
        "createService",
        { service },
        error
      );
    }
  }

  /**
   * Update service
   * @param id Service ID
   * @param updates Partial service data to update
   * @returns Updated service entity
   */
  async updateService(
    id: string,
    updates: Partial<ServiceEntity>
  ): Promise<ServiceEntity> {
    try {
      const updateData = {
        ...SupabaseShopBackendServiceMapper.toDatabase(
          updates as ServiceEntity
        ),
        updated_at: new Date().toISOString(),
      };

      const updatedService = await this.dataSource.update<ServiceSchemaRecord>(
        "services",
        id,
        updateData
      );

      if (!updatedService) {
        throw new ShopBackendServiceError(
          ShopBackendServiceErrorType.NOT_FOUND,
          "Service not found",
          "updateService",
          { id }
        );
      }

      return SupabaseShopBackendServiceMapper.toDomain(updatedService);
    } catch (error) {
      if (error instanceof ShopBackendServiceError) {
        throw error;
      }

      this.logger.error("Error in updateService", { error, id, updates });
      throw new ShopBackendServiceError(
        ShopBackendServiceErrorType.UNKNOWN,
        "An unexpected error occurred while updating service",
        "updateService",
        { id, updates },
        error
      );
    }
  }

  /**
   * Delete service
   * @param id Service ID
   * @returns Success flag
   */
  async deleteService(id: string): Promise<boolean> {
    try {
      // Check if service exists
      const existingService = await this.getServiceById(id);
      if (!existingService) {
        return false;
      }

      // Delete service
      const result = await this.dataSource.delete("services", id);

      return result !== null;
    } catch (error) {
      if (error instanceof ShopBackendServiceError) {
        throw error;
      }

      this.logger.error("Error in deleteService", { error, id });
      throw new ShopBackendServiceError(
        ShopBackendServiceErrorType.UNKNOWN,
        "An unexpected error occurred while deleting service",
        "deleteService",
        { id },
        error
      );
    }
  }

  /**
   * Toggle service availability
   * @param id Service ID
   * @param isAvailable Availability flag
   * @returns Success flag
   */
  async toggleAvailability(id: string, isAvailable: boolean): Promise<boolean> {
    try {
      const updateData = {
        is_available: isAvailable,
        updated_at: new Date().toISOString(),
      };

      const updatedService = await this.dataSource.update<ServiceSchemaRecord>(
        "services",
        id,
        updateData
      );

      return !!updatedService;
    } catch (error) {
      if (error instanceof ShopBackendServiceError) {
        throw error;
      }

      this.logger.error("Error in toggleAvailability", {
        error,
        id,
        isAvailable,
      });
      throw new ShopBackendServiceError(
        ShopBackendServiceErrorType.UNKNOWN,
        "An unexpected error occurred while toggling service availability",
        "toggleAvailability",
        { id, isAvailable },
        error
      );
    }
  }

  /**
   * Get service statistics from database
   * @returns Service statistics
   */
  async getServiceStats(): Promise<ServiceStatsEntity> {
    try {
      // Use getAdvanced to fetch statistics data
      const queryOptions: QueryOptions = {
        select: ["*"],
        // No joins needed for stats view
        // No pagination needed, we want all stats
      };

      // Assuming a view exists for service statistics
      // Use extended type that satisfies Record<string, unknown> constraint
      const statsData =
        await this.dataSource.getAdvanced<ServiceStatsSchemaRecord>(
          "service_stats_summary_view",
          queryOptions
        );

      if (!statsData || statsData.length === 0) {
        // If no stats are found, return default values
        return {
          totalServices: 0,
          availableServices: 0,
          unavailableServices: 0,
          averagePrice: 0,
          totalRevenue: 0,
          servicesByCategory: {},
          popularServices: [],
        };
      }

      // Map database results to domain entity
      // Assuming the first record contains all stats
      return SupabaseShopBackendServiceMapper.statsToEntity(statsData[0]);
    } catch (error) {
      if (error instanceof ShopBackendServiceError) {
        throw error;
      }

      this.logger.error("Error in getServiceStats", { error });
      throw new ShopBackendServiceError(
        ShopBackendServiceErrorType.UNKNOWN,
        "An unexpected error occurred while fetching service statistics",
        "getServiceStats",
        {},
        error
      );
    }
  }
}
