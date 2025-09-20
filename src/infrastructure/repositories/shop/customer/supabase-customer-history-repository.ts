import {
  DatabaseDataSource,
  FilterOperator,
  QueryOptions,
  SortDirection,
} from "@/src/domain/interfaces/datasources/database-datasource";
import type { Logger } from "@/src/domain/interfaces/logger";
import type { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import type {
  CustomerQueueHistoryEntity,
  CustomerStatsEntity,
  CustomerInfoEntity,
} from "@/src/domain/entities/shop/customer/customer-history.entity";
import {
  ShopCustomerHistoryError,
  ShopCustomerHistoryErrorType,
  ShopCustomerHistoryRepository,
} from "@/src/domain/repositories/shop/customer/customer-history-repository";
import { SupabaseCustomerHistoryMapper } from "@/src/infrastructure/mappers/shop/customer/supabase-customer-history-mapper";
import {
  CustomerQueueHistorySchema,
  CustomerStatsSchema,
  CustomerInfoSchema,
} from "@/src/infrastructure/schemas/shop/customer/customer-history.schema";
import { StandardRepository } from "../../base/standard-repository";

// Extended types for database records
type CustomerQueueHistorySchemaRecord = Record<string, unknown> & CustomerQueueHistorySchema;
type CustomerStatsSchemaRecord = Record<string, unknown> & CustomerStatsSchema;
type CustomerInfoSchemaRecord = Record<string, unknown> & CustomerInfoSchema;

/**
 * Supabase implementation of the customer history repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseCustomerHistoryRepository
  extends StandardRepository
  implements ShopCustomerHistoryRepository
{
  constructor(dataSource: DatabaseDataSource, logger: Logger) {
    super(dataSource, logger, "CustomerHistory");
  }

  /**
   * Get paginated customer queue history
   * @param params Pagination parameters with filters
   * @returns Paginated customer queue history data
   */
  async getCustomerQueueHistory(params: PaginationParams & {
    shopId: string;
    customerId?: string;
    filters?: {
      status?: "all" | "completed" | "cancelled" | "no_show";
      dateRange?: "all" | "month" | "quarter" | "year";
      shop?: string;
      startDate?: string;
      endDate?: string;
    };
  }): Promise<{
    data: CustomerQueueHistoryEntity[];
    pagination: {
      currentPage: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    try {
      const { shopId, customerId, page = 1, limit = 10, filters } = params;

      if (!shopId) {
        throw new ShopCustomerHistoryError(
          ShopCustomerHistoryErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "SupabaseCustomerHistoryRepository.getCustomerQueueHistory",
          { shopId }
        );
      }

      this.logger.info("Getting customer queue history", { shopId, customerId, page, limit, filters });

      // Build query options for Supabase
      const queryOptions: QueryOptions = {
        filters: [],
        sort: [
          {
            field: "queueDate",
            direction: SortDirection.DESC,
          },
        ],
      };

      // Add filters
      if (filters) {
        if (filters.status && filters.status !== "all") {
          queryOptions.filters?.push({
            field: "status",
            operator: FilterOperator.EQ,
            value: filters.status,
          });
        }

        if (filters.shop && filters.shop !== "all") {
          queryOptions.filters?.push({
            field: "shopName",
            operator: FilterOperator.ILIKE,
            value: filters.shop,
          });
        }

        // Date range filtering
        if (filters.dateRange && filters.dateRange !== "all") {
          const now = new Date();
          let startDate: Date;

          switch (filters.dateRange) {
            case "month":
              startDate = new Date(now.getFullYear(), now.getMonth(), 1);
              break;
            case "quarter":
              const quarter = Math.floor(now.getMonth() / 3);
              startDate = new Date(now.getFullYear(), quarter * 3, 1);
              break;
            case "year":
              startDate = new Date(now.getFullYear(), 0, 1);
              break;
            default:
              startDate = new Date(0);
          }

          queryOptions.filters?.push({
            field: "queueDate",
            operator: FilterOperator.GTE,
            value: startDate.toISOString().split('T')[0],
          });
        }

        // Custom date range
        if (filters.startDate) {
          queryOptions.filters?.push({
            field: "queueDate",
            operator: FilterOperator.GTE,
            value: filters.startDate,
          });
        }

        if (filters.endDate) {
          queryOptions.filters?.push({
            field: "queueDate",
            operator: FilterOperator.LTE,
            value: filters.endDate,
          });
        }
      }

      // Add shop filter
      queryOptions.filters?.push({
        field: "shopId",
        operator: FilterOperator.EQ,
        value: shopId,
      });

      // Add customer filter if provided
      if (customerId) {
        queryOptions.filters?.push({
          field: "customerId",
          operator: FilterOperator.EQ,
          value: customerId,
        });
      }

      // Fetch data from Supabase
      const result = await this.dataSource.getAdvanced(
        "customer_queue_history",
        queryOptions
      );

      if (!result || !Array.isArray(result)) {
        throw new ShopCustomerHistoryError(
          ShopCustomerHistoryErrorType.UNKNOWN,
          "Failed to fetch customer queue history",
          "SupabaseCustomerHistoryRepository.getCustomerQueueHistory",
          { shopId, customerId }
        );
      }

      const queueData = result as Array<CustomerQueueHistorySchemaRecord>;
      
      // Apply pagination manually
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = queueData.slice(startIndex, endIndex);
      
      // Transform the data using the mapper
      const transformedData = paginatedData.map((item: CustomerQueueHistorySchemaRecord) =>
        SupabaseCustomerHistoryMapper.toQueueHistoryEntity(item)
      );

      return {
        data: transformedData,
        pagination: {
          currentPage: page,
          perPage: limit,
          totalItems: queueData.length,
          totalPages: Math.ceil(queueData.length / limit),
          hasNext: endIndex < queueData.length,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      if (error instanceof ShopCustomerHistoryError) {
        throw error;
      }

      throw new ShopCustomerHistoryError(
        ShopCustomerHistoryErrorType.UNKNOWN,
        "Failed to get customer queue history",
        "SupabaseCustomerHistoryRepository.getCustomerQueueHistory",
        { params },
        error as Error
      );
    }
  }

  /**
   * Get customer statistics
   * @param shopId Shop ID
   * @param customerId Customer ID (optional)
   * @returns Customer statistics data
   */
  async getCustomerStats(shopId: string, customerId?: string): Promise<CustomerStatsEntity> {
    try {
      if (!shopId) {
        throw new ShopCustomerHistoryError(
          ShopCustomerHistoryErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "SupabaseCustomerHistoryRepository.getCustomerStats",
          { shopId }
        );
      }

      this.logger.info("Getting customer stats", { shopId, customerId });

      // Build query options
      const queryOptions: QueryOptions = {
        filters: [
          {
            field: "shopId",
            operator: FilterOperator.EQ,
            value: shopId,
          },
        ],
      };

      if (customerId) {
        queryOptions.filters?.push({
          field: "customerId",
          operator: FilterOperator.EQ,
          value: customerId,
        });
      }

      // Fetch customer statistics from Supabase
      const result = await this.dataSource.getAdvanced("customer_stats", queryOptions);

      if (!result || !Array.isArray(result) || result.length === 0) {
        throw new ShopCustomerHistoryError(
          ShopCustomerHistoryErrorType.NOT_FOUND,
          `Customer stats not found for shop ${shopId}`,
          "SupabaseCustomerHistoryRepository.getCustomerStats",
          { shopId, customerId }
        );
      }

      const statsData = result[0] as CustomerStatsSchemaRecord;

      return SupabaseCustomerHistoryMapper.toStatsEntity(statsData);
    } catch (error) {
      if (error instanceof ShopCustomerHistoryError) {
        throw error;
      }

      throw new ShopCustomerHistoryError(
        ShopCustomerHistoryErrorType.UNKNOWN,
        "Failed to get customer stats",
        "SupabaseCustomerHistoryRepository.getCustomerStats",
        { shopId, customerId },
        error as Error
      );
    }
  }

  /**
   * Get customer information
   * @param shopId Shop ID
   * @param customerId Customer ID (optional)
   * @returns Customer information including name
   */
  async getCustomerInfo(shopId: string, customerId?: string): Promise<CustomerInfoEntity> {
    try {
      if (!shopId) {
        throw new ShopCustomerHistoryError(
          ShopCustomerHistoryErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "SupabaseCustomerHistoryRepository.getCustomerInfo",
          { shopId }
        );
      }

      this.logger.info("Getting customer info", { shopId, customerId });

      // Build query options
      const queryOptions: QueryOptions = {
        filters: [
          {
            field: "shopId",
            operator: FilterOperator.EQ,
            value: shopId,
          },
        ],
      };

      if (customerId) {
        queryOptions.filters?.push({
          field: "customerId",
          operator: FilterOperator.EQ,
          value: customerId,
        });
      }

      // Fetch customer information from Supabase
      const result = await this.dataSource.getAdvanced("customer_info", queryOptions);

      if (!result || !Array.isArray(result) || result.length === 0) {
        // Return default customer info if not found
        return SupabaseCustomerHistoryMapper.toCustomerInfoEntity({
          id: "",
          shop_id: shopId,
          customer_id: customerId || "",
          customer_name: "ลูกค้า",
          member_since: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as CustomerInfoSchema);
      }

      const customerData = result[0] as CustomerInfoSchemaRecord;

      return SupabaseCustomerHistoryMapper.toCustomerInfoEntity(customerData);
    } catch (error) {
      if (error instanceof ShopCustomerHistoryError) {
        throw error;
      }

      throw new ShopCustomerHistoryError(
        ShopCustomerHistoryErrorType.UNKNOWN,
        "Failed to get customer info",
        "SupabaseCustomerHistoryRepository.getCustomerInfo",
        { shopId, customerId },
        error as Error
      );
    }
  }
}
