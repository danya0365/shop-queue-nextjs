import type {
  CustomerInfoEntity,
  CustomerQueueHistoryResult,
  CustomerStatsEntity,
  GetCustomerQueueHistoryWithPaginationParams,
} from "@/src/domain/entities/shop/customer/customer-history.entity";
import { DatabaseDataSource } from "@/src/domain/interfaces/datasources/database-datasource";
import type { Logger } from "@/src/domain/interfaces/logger";
import {
  ShopCustomerHistoryError,
  ShopCustomerHistoryErrorType,
  ShopCustomerHistoryRepository,
} from "@/src/domain/repositories/shop/customer/customer-history-repository";
import { SupabaseCustomerHistoryMapper } from "@/src/infrastructure/mappers/shop/customer/supabase-customer-history-mapper";
import {
  GetCustomerInfoByCustomerSchema,
  GetCustomerQueueHistoryByCustomerResult,
  GetCustomerQueueHistoryByCustomerSchema,
  GetCustomerStatsByCustomerSchema,
} from "@/src/infrastructure/schemas/shop/customer/customer-history.schema";
import { StandardRepository } from "../../base/standard-repository";

// Extended types for database records
// Note: Using RPC schema types directly for type safety

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
  async getCustomerQueueHistory(
    params: GetCustomerQueueHistoryWithPaginationParams
  ): Promise<CustomerQueueHistoryResult> {
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

      if (!customerId) {
        throw new ShopCustomerHistoryError(
          ShopCustomerHistoryErrorType.VALIDATION_ERROR,
          "Customer ID is required",
          "SupabaseCustomerHistoryRepository.getCustomerQueueHistory",
          { customerId }
        );
      }

      this.logger.info("Getting customer queue history", {
        shopId,
        customerId,
        page,
        limit,
        filters,
      });

      // Fetch data using RPC function
      const rpcParams = {
        p_customer_id: customerId,
        p_shop_id: shopId,
        p_page: page,
        p_limit: limit,
        p_status: filters?.status || "all",
        p_date_range: filters?.dateRange || "all",
        p_start_date: filters?.startDate || null,
        p_end_date: filters?.endDate || null,
      };

      const result =
        await this.dataSource.callRpc<GetCustomerQueueHistoryByCustomerResult>(
          "get_customer_queue_history_by_customer",
          rpcParams
        );

      if (!result) {
        throw new ShopCustomerHistoryError(
          ShopCustomerHistoryErrorType.UNKNOWN,
          "Failed to fetch customer queue history",
          "SupabaseCustomerHistoryRepository.getCustomerQueueHistory",
          { shopId, customerId, rpcParams }
        );
      }

      const rpcResult = result;

      if (
        !rpcResult.data ||
        !Array.isArray(rpcResult.data) ||
        !rpcResult.pagination
      ) {
        throw new ShopCustomerHistoryError(
          ShopCustomerHistoryErrorType.UNKNOWN,
          "Invalid RPC result structure",
          "SupabaseCustomerHistoryRepository.getCustomerQueueHistory",
          { shopId, customerId, rpcParams }
        );
      }

      // Transform the data using the RPC mapper
      const transformedData = rpcResult.data.map(
        (item: GetCustomerQueueHistoryByCustomerSchema) =>
          SupabaseCustomerHistoryMapper.toQueueHistoryEntityFromRPC(item)
      );
      return {
        data: transformedData,
        pagination: rpcResult.pagination,
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
   * @param customerId Customer ID (required)
   * @returns Customer statistics data
   */
  async getCustomerStats(
    shopId: string,
    customerId: string
  ): Promise<CustomerStatsEntity> {
    try {
      if (!shopId) {
        throw new ShopCustomerHistoryError(
          ShopCustomerHistoryErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "SupabaseCustomerHistoryRepository.getCustomerStats",
          { shopId }
        );
      }

      if (!customerId) {
        throw new ShopCustomerHistoryError(
          ShopCustomerHistoryErrorType.VALIDATION_ERROR,
          "Customer ID is required",
          "SupabaseCustomerHistoryRepository.getCustomerStats",
          { customerId }
        );
      }

      this.logger.info("Getting customer stats", { shopId, customerId });

      // Fetch customer statistics using RPC function
      const rpcParams = {
        p_customer_id: customerId,
        p_shop_id: shopId,
      };

      const result = await this.dataSource.callRpc<
        GetCustomerStatsByCustomerSchema[]
      >("get_customer_stats_by_customer", rpcParams);

      if (!result || !Array.isArray(result) || result.length === 0) {
        throw new ShopCustomerHistoryError(
          ShopCustomerHistoryErrorType.NOT_FOUND,
          `Customer stats not found for customer ${customerId} in shop ${shopId}`,
          "SupabaseCustomerHistoryRepository.getCustomerStats",
          { shopId, customerId }
        );
      }

      const statsData = result[0];

      return SupabaseCustomerHistoryMapper.toStatsEntityFromRPC(statsData);
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
   * @param customerId Customer ID (required)
   * @returns Customer information including name
   */
  async getCustomerInfo(
    shopId: string,
    customerId: string
  ): Promise<CustomerInfoEntity> {
    try {
      if (!shopId) {
        throw new ShopCustomerHistoryError(
          ShopCustomerHistoryErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "SupabaseCustomerHistoryRepository.getCustomerInfo",
          { shopId }
        );
      }

      if (!customerId) {
        throw new ShopCustomerHistoryError(
          ShopCustomerHistoryErrorType.VALIDATION_ERROR,
          "Customer ID is required",
          "SupabaseCustomerHistoryRepository.getCustomerInfo",
          { customerId }
        );
      }

      this.logger.info("Getting customer info", { shopId, customerId });

      // Fetch customer information using RPC function
      const rpcParams = {
        p_customer_id: customerId,
        p_shop_id: shopId,
      };

      const result = await this.dataSource.callRpc<
        GetCustomerInfoByCustomerSchema[]
      >("get_customer_info_by_customer", rpcParams);

      if (!result || !Array.isArray(result) || result.length === 0) {
        throw new ShopCustomerHistoryError(
          ShopCustomerHistoryErrorType.NOT_FOUND,
          `Customer info not found for customer ${customerId} in shop ${shopId}`,
          "SupabaseCustomerHistoryRepository.getCustomerInfo",
          { shopId, customerId }
        );
      }

      const customerData = result[0];

      return SupabaseCustomerHistoryMapper.toCustomerInfoEntityFromRPC(
        customerData
      );
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
