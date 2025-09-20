import {
  DatabaseDataSource,
  FilterOperator,
  QueryOptions,
  SortDirection,
} from "@/src/domain/interfaces/datasources/database-datasource";
import type { Logger } from "@/src/domain/interfaces/logger";
import type { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import type {
  CustomerRewardEntity,
  CustomerPointsEntity,
  RewardTransactionEntity,
  AvailableRewardEntity,
  CustomerRewardStatsEntity,
} from "@/src/domain/entities/shop/customer/customer-reward.entity";
import {
  ShopCustomerRewardError,
  ShopCustomerRewardErrorType,
  ShopCustomerRewardRepository,
} from "@/src/domain/repositories/shop/customer/customer-reward-repository";
import { SupabaseCustomerRewardMapper } from "@/src/infrastructure/mappers/shop/customer/supabase-customer-reward-mapper";
import {
  CustomerPointsSchema,
  CustomerRewardSchema,
  RewardTransactionSchema,
  AvailableRewardSchema,
  CustomerRewardStatsSchema,
  CustomerInfoSchema,
} from "@/src/infrastructure/schemas/shop/customer/customer-reward.schema";
import { StandardRepository } from "../../base/standard-repository";

// Extended types for database records
type CustomerPointsSchemaRecord = Record<string, unknown> & CustomerPointsSchema;
type CustomerRewardSchemaRecord = Record<string, unknown> & CustomerRewardSchema;
type RewardTransactionSchemaRecord = Record<string, unknown> & RewardTransactionSchema;
type AvailableRewardSchemaRecord = Record<string, unknown> & AvailableRewardSchema;
type CustomerRewardStatsSchemaRecord = Record<string, unknown> & CustomerRewardStatsSchema;
type CustomerInfoSchemaRecord = Record<string, unknown> & CustomerInfoSchema;

/**
 * Supabase implementation of the customer reward repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseCustomerRewardRepository
  extends StandardRepository
  implements ShopCustomerRewardRepository
{
  constructor(dataSource: DatabaseDataSource, logger: Logger) {
    super(dataSource, logger, "CustomerReward");
  }

  /**
   * Get customer points information
   * @param shopId The shop ID
   * @param customerId The customer ID
   * @returns Customer points entity
   */
  async getCustomerPoints(shopId: string, customerId: string): Promise<CustomerPointsEntity> {
    try {
      if (!shopId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "SupabaseCustomerRewardRepository.getCustomerPoints",
          { shopId }
        );
      }

      if (!customerId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Customer ID is required",
          "SupabaseCustomerRewardRepository.getCustomerPoints",
          { customerId }
        );
      }

      this.logger.info("Getting customer points", { shopId, customerId });

      const queryOptions: QueryOptions = {
        filters: [
          {
            field: "shop_id",
            operator: FilterOperator.EQ,
            value: shopId,
          },
          {
            field: "customer_id",
            operator: FilterOperator.EQ,
            value: customerId,
          },
        ],
      };

      const result = await this.dataSource.findOne<CustomerPointsSchemaRecord>(
        "customer_points",
        queryOptions
      );

      if (!result) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.NOT_FOUND,
          "Customer points not found",
          "SupabaseCustomerRewardRepository.getCustomerPoints",
          { shopId, customerId }
        );
      }

      return SupabaseCustomerRewardMapper.toCustomerPointsEntity(result);
    } catch (error) {
      if (error instanceof ShopCustomerRewardError) {
        throw error;
      }

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.OPERATION_FAILED,
        "Failed to get customer points",
        "SupabaseCustomerRewardRepository.getCustomerPoints",
        { shopId, customerId },
        error
      );
    }
  }

  /**
   * Get available rewards with pagination and filters
   * @param params Pagination parameters with filters
   * @returns Paginated available rewards data
   */
  async getAvailableRewards(params: PaginationParams & {
    shopId: string;
    customerId?: string;
    filters?: {
      category?: string;
      type?: "discount" | "free_item" | "cashback" | "points";
      isAvailable?: boolean;
      minPointsCost?: number;
      maxPointsCost?: number;
    };
  }): Promise<{
    data: AvailableRewardEntity[];
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
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "SupabaseCustomerRewardRepository.getAvailableRewards",
          { shopId }
        );
      }

      this.logger.info("Getting available rewards", { shopId, customerId, page, limit, filters });

      // Build query options for Supabase
      const queryOptions: QueryOptions = {
        filters: [
          {
            field: "shop_id",
            operator: FilterOperator.EQ,
            value: shopId,
          },
        ],
        sort: [
          {
            field: "points_cost",
            direction: SortDirection.ASC,
          },
        ],
      };

      // Add filters
      if (filters) {
        if (filters.category) {
          queryOptions.filters?.push({
            field: "category",
            operator: FilterOperator.EQ,
            value: filters.category,
          });
        }

        if (filters.type) {
          queryOptions.filters?.push({
            field: "type",
            operator: FilterOperator.EQ,
            value: filters.type,
          });
        }

        if (filters.isAvailable !== undefined) {
          queryOptions.filters?.push({
            field: "is_available",
            operator: FilterOperator.EQ,
            value: filters.isAvailable,
          });
        }

        if (filters.minPointsCost !== undefined) {
          queryOptions.filters?.push({
            field: "points_cost",
            operator: FilterOperator.GTE,
            value: filters.minPointsCost,
          });
        }

        if (filters.maxPointsCost !== undefined) {
          queryOptions.filters?.push({
            field: "points_cost",
            operator: FilterOperator.LTE,
            value: filters.maxPointsCost,
          });
        }
      }

      const result = await this.dataSource.findPaginated<AvailableRewardSchemaRecord>(
        "available_rewards",
        page,
        limit,
        queryOptions
      );

      const availableRewards = result.data.map((reward) =>
        SupabaseCustomerRewardMapper.toAvailableRewardEntity(reward)
      );

      return {
        data: availableRewards,
        pagination: result.pagination,
      };
    } catch (error) {
      if (error instanceof ShopCustomerRewardError) {
        throw error;
      }

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.OPERATION_FAILED,
        "Failed to get available rewards",
        "SupabaseCustomerRewardRepository.getAvailableRewards",
        { shopId, customerId, page, limit, filters },
        error
      );
    }
  }

  /**
   * Get redeemed rewards with pagination and filters
   * @param params Pagination parameters with filters
   * @returns Paginated redeemed rewards data
   */
  async getRedeemedRewards(params: PaginationParams & {
    shopId: string;
    customerId: string;
    filters?: {
      category?: string;
      type?: "discount" | "free_item" | "cashback" | "points";
      dateRange?: "all" | "month" | "quarter" | "year" | "custom";
      startDate?: string;
      endDate?: string;
    };
  }): Promise<{
    data: CustomerRewardEntity[];
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
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "SupabaseCustomerRewardRepository.getRedeemedRewards",
          { shopId }
        );
      }

      if (!customerId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Customer ID is required",
          "SupabaseCustomerRewardRepository.getRedeemedRewards",
          { customerId }
        );
      }

      this.logger.info("Getting redeemed rewards", { shopId, customerId, page, limit, filters });

      // Build query options for Supabase
      const queryOptions: QueryOptions = {
        filters: [
          {
            field: "shop_id",
            operator: FilterOperator.EQ,
            value: shopId,
          },
          {
            field: "customer_id",
            operator: FilterOperator.EQ,
            value: customerId,
          },
          {
            field: "is_redeemed",
            operator: FilterOperator.EQ,
            value: true,
          },
        ],
        sort: [
          {
            field: "redeemed_at",
            direction: SortDirection.DESC,
          },
        ],
      };

      // Add filters
      if (filters) {
        if (filters.category) {
          queryOptions.filters?.push({
            field: "category",
            operator: FilterOperator.EQ,
            value: filters.category,
          });
        }

        if (filters.type) {
          queryOptions.filters?.push({
            field: "type",
            operator: FilterOperator.EQ,
            value: filters.type,
          });
        }

        // Handle date range filtering
        if (filters.dateRange && filters.dateRange !== "all") {
          const now = new Date();
          let startDate: Date;
          let endDate: Date = now;

          switch (filters.dateRange) {
            case "month":
              startDate = new Date(now.getFullYear(), now.getMonth(), 1);
              break;
            case "quarter":
              const quarterStart = Math.floor(now.getMonth() / 3) * 3;
              startDate = new Date(now.getFullYear(), quarterStart, 1);
              break;
            case "year":
              startDate = new Date(now.getFullYear(), 0, 1);
              break;
            case "custom":
              if (filters.startDate && filters.endDate) {
                startDate = new Date(filters.startDate);
                endDate = new Date(filters.endDate);
              } else {
                break;
              }
              break;
            default:
              break;
          }

          if (startDate && endDate) {
            queryOptions.filters?.push({
              field: "redeemed_at",
              operator: FilterOperator.GTE,
              value: startDate.toISOString(),
            });
            queryOptions.filters?.push({
              field: "redeemed_at",
              operator: FilterOperator.LTE,
              value: endDate.toISOString(),
            });
          }
        }
      }

      const result = await this.dataSource.findPaginated<CustomerRewardSchemaRecord>(
        "customer_rewards",
        page,
        limit,
        queryOptions
      );

      const redeemedRewards = result.data.map((reward) =>
        SupabaseCustomerRewardMapper.toCustomerRewardEntity(reward)
      );

      return {
        data: redeemedRewards,
        pagination: result.pagination,
      };
    } catch (error) {
      if (error instanceof ShopCustomerRewardError) {
        throw error;
      }

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.OPERATION_FAILED,
        "Failed to get redeemed rewards",
        "SupabaseCustomerRewardRepository.getRedeemedRewards",
        { shopId, customerId, page, limit, filters },
        error
      );
    }
  }

  /**
   * Get reward transactions with pagination and filters
   * @param params Pagination parameters with filters
   * @returns Paginated reward transactions data
   */
  async getRewardTransactions(params: PaginationParams & {
    shopId: string;
    customerId: string;
    filters?: {
      type?: "earned" | "redeemed" | "expired";
      dateRange?: "all" | "month" | "quarter" | "year" | "custom";
      startDate?: string;
      endDate?: string;
    };
  }): Promise<{
    data: RewardTransactionEntity[];
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
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "SupabaseCustomerRewardRepository.getRewardTransactions",
          { shopId }
        );
      }

      if (!customerId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Customer ID is required",
          "SupabaseCustomerRewardRepository.getRewardTransactions",
          { customerId }
        );
      }

      this.logger.info("Getting reward transactions", { shopId, customerId, page, limit, filters });

      // Build query options for Supabase
      const queryOptions: QueryOptions = {
        filters: [
          {
            field: "shop_id",
            operator: FilterOperator.EQ,
            value: shopId,
          },
          {
            field: "customer_id",
            operator: FilterOperator.EQ,
            value: customerId,
          },
        ],
        sort: [
          {
            field: "date",
            direction: SortDirection.DESC,
          },
        ],
      };

      // Add filters
      if (filters) {
        if (filters.type) {
          queryOptions.filters?.push({
            field: "type",
            operator: FilterOperator.EQ,
            value: filters.type,
          });
        }

        // Handle date range filtering
        if (filters.dateRange && filters.dateRange !== "all") {
          const now = new Date();
          let startDate: Date;
          let endDate: Date = now;

          switch (filters.dateRange) {
            case "month":
              startDate = new Date(now.getFullYear(), now.getMonth(), 1);
              break;
            case "quarter":
              const quarterStart = Math.floor(now.getMonth() / 3) * 3;
              startDate = new Date(now.getFullYear(), quarterStart, 1);
              break;
            case "year":
              startDate = new Date(now.getFullYear(), 0, 1);
              break;
            case "custom":
              if (filters.startDate && filters.endDate) {
                startDate = new Date(filters.startDate);
                endDate = new Date(filters.endDate);
              } else {
                break;
              }
              break;
            default:
              break;
          }

          if (startDate && endDate) {
            queryOptions.filters?.push({
              field: "date",
              operator: FilterOperator.GTE,
              value: startDate.toISOString(),
            });
            queryOptions.filters?.push({
              field: "date",
              operator: FilterOperator.LTE,
              value: endDate.toISOString(),
            });
          }
        }
      }

      const result = await this.dataSource.findPaginated<RewardTransactionSchemaRecord>(
        "reward_transactions",
        page,
        limit,
        queryOptions
      );

      const rewardTransactions = result.data.map((transaction) =>
        SupabaseCustomerRewardMapper.toRewardTransactionEntity(transaction)
      );

      return {
        data: rewardTransactions,
        pagination: result.pagination,
      };
    } catch (error) {
      if (error instanceof ShopCustomerRewardError) {
        throw error;
      }

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.OPERATION_FAILED,
        "Failed to get reward transactions",
        "SupabaseCustomerRewardRepository.getRewardTransactions",
        { shopId, customerId, page, limit, filters },
        error
      );
    }
  }

  /**
   * Get reward details by ID
   * @param shopId The shop ID
   * @param rewardId The reward ID
   * @param customerId The customer ID (optional)
   * @returns Reward details entity
   */
  async getRewardById(shopId: string, rewardId: string, customerId?: string): Promise<CustomerRewardEntity | AvailableRewardEntity> {
    try {
      if (!shopId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "SupabaseCustomerRewardRepository.getRewardById",
          { shopId }
        );
      }

      if (!rewardId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Reward ID is required",
          "SupabaseCustomerRewardRepository.getRewardById",
          { rewardId }
        );
      }

      this.logger.info("Getting reward details", { shopId, rewardId, customerId });

      // Try to get from customer rewards first (if customerId is provided)
      if (customerId) {
        const customerRewardQueryOptions: QueryOptions = {
          filters: [
            {
              field: "shop_id",
              operator: FilterOperator.EQ,
              value: shopId,
            },
            {
              field: "customer_id",
              operator: FilterOperator.EQ,
              value: customerId,
            },
            {
              field: "reward_id",
              operator: FilterOperator.EQ,
              value: rewardId,
            },
          ],
        };

        const customerReward = await this.dataSource.findOne<CustomerRewardSchemaRecord>(
          "customer_rewards",
          customerRewardQueryOptions
        );

        if (customerReward) {
          return SupabaseCustomerRewardMapper.toCustomerRewardEntity(customerReward);
        }
      }

      // If not found in customer rewards, try available rewards
      const availableRewardQueryOptions: QueryOptions = {
        filters: [
          {
            field: "shop_id",
            operator: FilterOperator.EQ,
            value: shopId,
          },
          {
            field: "id",
            operator: FilterOperator.EQ,
            value: rewardId,
          },
        ],
      };

      const availableReward = await this.dataSource.findOne<AvailableRewardSchemaRecord>(
        "available_rewards",
        availableRewardQueryOptions
      );

      if (!availableReward) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.NOT_FOUND,
          "Reward not found",
          "SupabaseCustomerRewardRepository.getRewardById",
          { shopId, rewardId, customerId }
        );
      }

      return SupabaseCustomerRewardMapper.toAvailableRewardEntity(availableReward);
    } catch (error) {
      if (error instanceof ShopCustomerRewardError) {
        throw error;
      }

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.OPERATION_FAILED,
        "Failed to get reward details",
        "SupabaseCustomerRewardRepository.getRewardById",
        { shopId, rewardId, customerId },
        error
      );
    }
  }

  /**
   * Redeem a reward for a customer
   * @param shopId The shop ID
   * @param customerId The customer ID
   * @param rewardId The reward ID
   * @returns Redeemed reward entity
   */
  async redeemReward(shopId: string, customerId: string, rewardId: string): Promise<CustomerRewardEntity> {
    try {
      if (!shopId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "SupabaseCustomerRewardRepository.redeemReward",
          { shopId }
        );
      }

      if (!customerId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Customer ID is required",
          "SupabaseCustomerRewardRepository.redeemReward",
          { customerId }
        );
      }

      if (!rewardId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Reward ID is required",
          "SupabaseCustomerRewardRepository.redeemReward",
          { rewardId }
        );
      }

      this.logger.info("Redeeming reward", { shopId, customerId, rewardId });

      // Get the available reward details
      const availableRewardQueryOptions: QueryOptions = {
        filters: [
          {
            field: "shop_id",
            operator: FilterOperator.EQ,
            value: shopId,
          },
          {
            field: "id",
            operator: FilterOperator.EQ,
            value: rewardId,
          },
        ],
      };

      const availableReward = await this.dataSource.findOne<AvailableRewardSchemaRecord>(
        "available_rewards",
        availableRewardQueryOptions
      );

      if (!availableReward) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.NOT_FOUND,
          "Available reward not found",
          "SupabaseCustomerRewardRepository.redeemReward",
          { shopId, rewardId }
        );
      }

      // Create customer reward record
      const customerRewardData: Partial<CustomerRewardSchema> = {
        shop_id: shopId,
        customer_id: customerId,
        reward_id: rewardId,
        name: availableReward.name,
        description: availableReward.description,
        type: availableReward.type,
        value: availableReward.value,
        points_cost: availableReward.points_cost,
        category: availableReward.category,
        image_url: availableReward.image_url,
        expiry_date: availableReward.expiry_date,
        terms_and_conditions: availableReward.terms_and_conditions,
        is_available: availableReward.is_available,
        is_redeemed: true,
        redeemed_at: new Date().toISOString(),
      };

      const redeemedReward = await this.dataSource.create<CustomerRewardSchemaRecord>(
        "customer_rewards",
        customerRewardData
      );

      // Update customer points (deduct points)
      const customerPointsQueryOptions: QueryOptions = {
        filters: [
          {
            field: "shop_id",
            operator: FilterOperator.EQ,
            value: shopId,
          },
          {
            field: "customer_id",
            operator: FilterOperator.EQ,
            value: customerId,
          },
        ],
      };

      const customerPoints = await this.dataSource.findOne<CustomerPointsSchemaRecord>(
        "customer_points",
        customerPointsQueryOptions
      );

      if (customerPoints) {
        const updatedPointsData: Partial<CustomerPointsSchema> = {
          current_points: Math.max(0, customerPoints.current_points - availableReward.points_cost),
          total_redeemed: customerPoints.total_redeemed + availableReward.points_cost,
        };

        await this.dataSource.update<CustomerPointsSchemaRecord>(
          "customer_points",
          customerPoints.id,
          updatedPointsData
        );
      }

      // Create reward transaction record
      const transactionData: Partial<RewardTransactionSchema> = {
        shop_id: shopId,
        customer_id: customerId,
        type: "redeemed",
        points: -availableReward.points_cost,
        description: `Redeemed reward: ${availableReward.name}`,
        date: new Date().toISOString(),
      };

      await this.dataSource.create<RewardTransactionSchemaRecord>(
        "reward_transactions",
        transactionData
      );

      return SupabaseCustomerRewardMapper.toCustomerRewardEntity(redeemedReward);
    } catch (error) {
      if (error instanceof ShopCustomerRewardError) {
        throw error;
      }

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.OPERATION_FAILED,
        "Failed to redeem reward",
        "SupabaseCustomerRewardRepository.redeemReward",
        { shopId, customerId, rewardId },
        error
      );
    }
  }

  /**
   * Get customer reward statistics
   * @param shopId The shop ID
   * @param customerId The customer ID
   * @returns Customer reward statistics entity
   */
  async getCustomerRewardStats(shopId: string, customerId: string): Promise<CustomerRewardStatsEntity> {
    try {
      if (!shopId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "SupabaseCustomerRewardRepository.getCustomerRewardStats",
          { shopId }
        );
      }

      if (!customerId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Customer ID is required",
          "SupabaseCustomerRewardRepository.getCustomerRewardStats",
          { customerId }
        );
      }

      this.logger.info("Getting customer reward statistics", { shopId, customerId });

      const queryOptions: QueryOptions = {
        filters: [
          {
            field: "shop_id",
            operator: FilterOperator.EQ,
            value: shopId,
          },
          {
            field: "customer_id",
            operator: FilterOperator.EQ,
            value: customerId,
          },
        ],
      };

      const result = await this.dataSource.findOne<CustomerRewardStatsSchemaRecord>(
        "customer_reward_stats",
        queryOptions
      );

      if (!result) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.NOT_FOUND,
          "Customer reward statistics not found",
          "SupabaseCustomerRewardRepository.getCustomerRewardStats",
          { shopId, customerId }
        );
      }

      return SupabaseCustomerRewardMapper.toCustomerRewardStatsEntity(result);
    } catch (error) {
      if (error instanceof ShopCustomerRewardError) {
        throw error;
      }

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.OPERATION_FAILED,
        "Failed to get customer reward statistics",
        "SupabaseCustomerRewardRepository.getCustomerRewardStats",
        { shopId, customerId },
        error
      );
    }
  }

  /**
   * Get customer information
   * @param shopId The shop ID
   * @param customerId The customer ID
   * @returns Customer information
   */
  async getCustomerInfo(shopId: string, customerId: string): Promise<{
    customerName: string;
    memberSince: string;
  }> {
    try {
      if (!shopId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "SupabaseCustomerRewardRepository.getCustomerInfo",
          { shopId }
        );
      }

      if (!customerId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Customer ID is required",
          "SupabaseCustomerRewardRepository.getCustomerInfo",
          { customerId }
        );
      }

      this.logger.info("Getting customer info", { shopId, customerId });

      const queryOptions: QueryOptions = {
        filters: [
          {
            field: "shop_id",
            operator: FilterOperator.EQ,
            value: shopId,
          },
          {
            field: "customer_id",
            operator: FilterOperator.EQ,
            value: customerId,
          },
        ],
      };

      const result = await this.dataSource.findOne<CustomerInfoSchemaRecord>(
        "customer_info",
        queryOptions
      );

      if (!result) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.NOT_FOUND,
          "Customer information not found",
          "SupabaseCustomerRewardRepository.getCustomerInfo",
          { shopId, customerId }
        );
      }

      return {
        customerName: result.customer_name,
        memberSince: result.member_since,
      };
    } catch (error) {
      if (error instanceof ShopCustomerRewardError) {
        throw error;
      }

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.OPERATION_FAILED,
        "Failed to get customer information",
        "SupabaseCustomerRewardRepository.getCustomerInfo",
        { shopId, customerId },
        error
      );
    }
  }
}
