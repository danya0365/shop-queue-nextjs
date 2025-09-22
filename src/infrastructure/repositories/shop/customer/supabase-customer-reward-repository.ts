import {
  DatabaseDataSource,
  FilterOperator,
  QueryOptions,
  SortDirection,
} from "@/src/domain/interfaces/datasources/database-datasource";
import type { Logger } from "@/src/domain/interfaces/logger";
import type { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import { RewardType } from "@/src/domain/entities/shop/backend/backend-reward.entity";
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
} from "@/src/infrastructure/schemas/shop/customer/customer-reward.schema";
import { StandardRepository } from "../../base/standard-repository";

// Extended types for database records
type CustomerPointsSchemaRecord = Record<string, unknown> & CustomerPointsSchema;
type CustomerRewardSchemaRecord = Record<string, unknown> & CustomerRewardSchema;
type RewardTransactionSchemaRecord = Record<string, unknown> & RewardTransactionSchema;
type AvailableRewardSchemaRecord = Record<string, unknown> & AvailableRewardSchema;
type CustomerRewardStatsSchemaRecord = Record<string, unknown> & CustomerRewardStatsSchema;

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

      const results = await this.dataSource.getAdvanced<CustomerPointsSchemaRecord>(
        "customer_points",
        queryOptions
      );

      const result = results[0]; // Get the first result

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

      // Add pagination to query options
      queryOptions.pagination = {
        page,
        pageSize: limit
      };

      const rewards = await this.dataSource.getAdvanced<AvailableRewardSchemaRecord>(
        "available_rewards",
        queryOptions
      );

      const availableRewards = rewards.map((reward: AvailableRewardSchemaRecord) =>
        SupabaseCustomerRewardMapper.toAvailableRewardEntity(reward)
      );

      return {
        data: availableRewards,
        pagination: {
          currentPage: page,
          perPage: limit,
          totalItems: availableRewards.length, // This would need to be calculated properly with a count query
          totalPages: Math.ceil(availableRewards.length / limit),
          hasNext: page < Math.ceil(availableRewards.length / limit),
          hasPrev: page > 1
        },
      };
    } catch (error) {
      if (error instanceof ShopCustomerRewardError) {
        throw error;
      }

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.OPERATION_FAILED,
        "Failed to get available rewards",
        "SupabaseCustomerRewardRepository.getAvailableRewards",
        { shopId: params.shopId, customerId: params.customerId, page: params.page, limit: params.limit, filters: params.filters },
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
      type?: RewardType;
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

        if (filters.dateRange && filters.dateRange !== "all") {
          const now = new Date();
          let startDate: Date;
          let endDate: Date;

          switch (filters.dateRange) {
            case "month":
              startDate = new Date(now.getFullYear(), now.getMonth(), 1);
              endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
              break;
            case "quarter":
              const quarter = Math.floor(now.getMonth() / 3);
              startDate = new Date(now.getFullYear(), quarter * 3, 1);
              endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
              break;
            case "year":
              startDate = new Date(now.getFullYear(), 0, 1);
              endDate = new Date(now.getFullYear(), 11, 31);
              break;
            case "custom":
              startDate = filters.startDate ? new Date(filters.startDate) : new Date();
              endDate = filters.endDate ? new Date(filters.endDate) : new Date();
              break;
            default:
              startDate = new Date();
              endDate = new Date();
          }

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

      // Add pagination to query options
      queryOptions.pagination = {
        page,
        pageSize: limit
      };

      const rewards = await this.dataSource.getAdvanced<CustomerRewardSchemaRecord>(
        "customer_rewards",
        queryOptions
      );

      const totalRedeemed = rewards.map((reward: CustomerRewardSchemaRecord) =>
        SupabaseCustomerRewardMapper.toCustomerRewardEntity(reward)
      );

      return {
        data: totalRedeemed,
        pagination: {
          currentPage: page,
          perPage: limit,
          totalItems: totalRedeemed.length, // This would need to be calculated properly with a count query
          totalPages: Math.ceil(totalRedeemed.length / limit),
          hasNext: page < Math.ceil(totalRedeemed.length / limit),
          hasPrev: page > 1
        },
      };
    } catch (error) {
      if (error instanceof ShopCustomerRewardError) {
        throw error;
      }

      // Explicitly declare variables for error context
      const errorContext = {
        shopId: params.shopId,
        customerId: params.customerId,
        page: params.page,
        limit: params.limit,
        filters: params.filters
      };

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.OPERATION_FAILED,
        "Failed to get redeemed rewards",
        "SupabaseCustomerRewardRepository.getRedeemedRewards",
        errorContext,
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
            field: "created_at",
            direction: SortDirection.DESC,
          },
        ],
      };

      // Add filters
      if (filters) {
        if (filters.type) {
          queryOptions.filters?.push({
            field: "transaction_type",
            operator: FilterOperator.EQ,
            value: filters.type,
          });
        }

        if (filters.dateRange && filters.dateRange !== "all") {
          const now = new Date();
          let startDate: Date;
          let endDate: Date;

          switch (filters.dateRange) {
            case "month":
              startDate = new Date(now.getFullYear(), now.getMonth(), 1);
              endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
              break;
            case "quarter":
              const quarter = Math.floor(now.getMonth() / 3);
              startDate = new Date(now.getFullYear(), quarter * 3, 1);
              endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
              break;
            case "year":
              startDate = new Date(now.getFullYear(), 0, 1);
              endDate = new Date(now.getFullYear(), 11, 31);
              break;
            case "custom":
              startDate = filters.startDate ? new Date(filters.startDate) : new Date();
              endDate = filters.endDate ? new Date(filters.endDate) : new Date();
              break;
            default:
              startDate = new Date();
              endDate = new Date();
          }

          queryOptions.filters?.push({
            field: "created_at",
            operator: FilterOperator.GTE,
            value: startDate.toISOString(),
          });
          queryOptions.filters?.push({
            field: "created_at",
            operator: FilterOperator.LTE,
            value: endDate.toISOString(),
          });
        }
      }

      // Add pagination to query options
      queryOptions.pagination = {
        page,
        pageSize: limit
      };

      const transactions = await this.dataSource.getAdvanced<RewardTransactionSchemaRecord>(
        "reward_transactions",
        queryOptions
      );

      const rewardTransactions = transactions.map((transaction: RewardTransactionSchemaRecord) =>
        SupabaseCustomerRewardMapper.toRewardTransactionEntity(transaction)
      );

      return {
        data: rewardTransactions,
        pagination: {
          currentPage: page,
          perPage: limit,
          totalItems: rewardTransactions.length, // This would need to be calculated properly with a count query
          totalPages: Math.ceil(rewardTransactions.length / limit),
          hasNext: page < Math.ceil(rewardTransactions.length / limit),
          hasPrev: page > 1
        },
      };
    } catch (error) {
      if (error instanceof ShopCustomerRewardError) {
        throw error;
      }

      // Explicitly declare variables for error context
      const errorContext = {
        shopId: params.shopId,
        customerId: params.customerId,
        page: params.page,
        limit: params.limit,
        filters: params.filters
      };

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.OPERATION_FAILED,
        "Failed to get reward transactions",
        "SupabaseCustomerRewardRepository.getRewardTransactions",
        errorContext,
        error
      );
    }
  }

  /**
   * Get reward details by ID
   * @param shopId The shop ID
   * @param rewardId The reward ID
   * @param customerId The customer ID (optional)
   * @returns Reward details
   */
  async getRewardById(
    shopId: string,
    rewardId: string,
    customerId?: string
  ): Promise<AvailableRewardEntity | CustomerRewardEntity> {
    try {
      if (!shopId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "SupabaseCustomerRewardRepository.getRewardById",
          { shopId }
        );
      }

      if (!customerId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Customer ID is required",
          "SupabaseCustomerRewardRepository.getRewardById",
          { customerId }
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

      this.logger.info("Getting reward by ID", { shopId, customerId, rewardId });

      // First try to get from customer rewards (redeemed rewards)
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
            field: "id",
            operator: FilterOperator.EQ,
            value: rewardId,
          },
        ],
      };

      const customerRewards = await this.dataSource.getAdvanced<CustomerRewardSchemaRecord>(
        "customer_rewards",
        customerRewardQueryOptions
      );

      if (customerRewards.length > 0) {
        return SupabaseCustomerRewardMapper.toCustomerRewardEntity(customerRewards[0]);
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

      const availableRewards = await this.dataSource.getAdvanced<AvailableRewardSchemaRecord>(
        "available_rewards",
        availableRewardQueryOptions
      );

      if (availableRewards.length > 0) {
        return SupabaseCustomerRewardMapper.toAvailableRewardEntity(availableRewards[0]);
      }

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.NOT_FOUND,
        "Reward not found",
        "SupabaseCustomerRewardRepository.getRewardById",
        { shopId, rewardId, customerId }
      );
    } catch (error) {
      if (error instanceof ShopCustomerRewardError) {
        throw error;
      }

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.OPERATION_FAILED,
        "Failed to get reward by ID",
        "SupabaseCustomerRewardRepository.getRewardById",
        { shopId, customerId, rewardId },
        error
      );
    }
  }

  /**
   * Redeem a reward
   * @param shopId The shop ID
   * @param customerId The customer ID
   * @param rewardId The reward ID
   * @returns The redeemed reward entity
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

      // Get the available reward
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
          {
            field: "is_available",
            operator: FilterOperator.EQ,
            value: true,
          },
        ],
      };

      const availableRewards = await this.dataSource.getAdvanced<AvailableRewardSchemaRecord>(
        "available_rewards",
        availableRewardQueryOptions
      );

      if (availableRewards.length === 0) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.NOT_FOUND,
          "Available reward not found",
          "SupabaseCustomerRewardRepository.redeemReward",
          { shopId, customerId, rewardId }
        );
      }

      const availableReward = availableRewards[0];

      // Check if customer has enough points
      const customerPoints = await this.getCustomerPoints(shopId, customerId);
      if (customerPoints.currentPoints < availableReward.points_cost) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.INSUFFICIENT_POINTS,
          "Insufficient points to redeem reward",
          "SupabaseCustomerRewardRepository.redeemReward",
          { shopId, customerId, rewardId, requiredPoints: availableReward.points_cost, availablePoints: customerPoints.currentPoints }
        );
      }

      // Create customer reward record
      const customerRewardData = {
        shop_id: shopId,
        customer_id: customerId,
        reward_id: rewardId,
        reward_name: availableReward.reward_name,
        reward_description: availableReward.reward_description,
        category: availableReward.category,
        points_cost: availableReward.points_cost,
        status: "pending",
        redeemed_at: new Date().toISOString(),
        expires_at: availableReward.expires_at,
      };

      const customerReward = await this.dataSource.insert<CustomerRewardSchemaRecord>(
        "customer_rewards",
        customerRewardData
      );

      // Create reward transaction record
      const transactionData = {
        shop_id: shopId,
        customer_id: customerId,
        reward_id: rewardId,
        transaction_type: "redemption",
        points_change: -availableReward.points_cost,
        balance_after: customerPoints.currentPoints - availableReward.points_cost,
        description: `Redeemed reward: ${availableReward.reward_name}`,
        created_at: new Date().toISOString(),
      };

      await this.dataSource.insert<RewardTransactionSchemaRecord>(
        "reward_transactions",
        transactionData
      );

      // Update customer points
      const updatedPointsData = {
        total_points: customerPoints.currentPoints - availableReward.points_cost,
        redeemed_rewards: customerPoints.totalRedeemed + 1,
        updated_at: new Date().toISOString(),
      };

      // First get the customer points record to get its ID
      const customerPointsRecords = await this.dataSource.getAdvanced<CustomerPointsSchemaRecord>(
        "customer_points",
        {
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
        }
      );

      if (customerPointsRecords.length === 0) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.NOT_FOUND,
          "Customer points record not found",
          "SupabaseCustomerRewardRepository.redeemReward",
          { shopId, customerId }
        );
      }

      const customerPointsId = customerPointsRecords[0].id;
      
      await this.dataSource.update(
        "customer_points",
        customerPointsId,
        updatedPointsData
      );

      return SupabaseCustomerRewardMapper.toCustomerRewardEntity(customerReward);
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

      this.logger.info("Getting customer reward stats", { shopId, customerId });

      // Get customer points
      const customerPoints = await this.getCustomerPoints(shopId, customerId);

      // Get redeemed rewards count
      const totalRedeemedQueryOptions: QueryOptions = {
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

      const totalRedeemed = await this.dataSource.getAdvanced<CustomerRewardSchemaRecord>(
        "customer_rewards",
        totalRedeemedQueryOptions
      );

      // Get reward transactions count
      const transactionsQueryOptions: QueryOptions = {
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

      const transactions = await this.dataSource.getAdvanced<RewardTransactionSchemaRecord>(
        "reward_transactions",
        transactionsQueryOptions
      );

      // Calculate statistics
      const statsData = {
        id: `${shopId}-${customerId}-${Date.now()}`, // Generate a unique ID
        shop_id: shopId,
        customer_id: customerId,
        total_rewards_available: 0, // This would need to be calculated from available rewards
        total_rewards_redeemed: totalRedeemed.length,
        total_points_earned: customerPoints.totalEarned,
        total_points_redeemed: transactions
          .filter(t => t.transaction_type === "redemption")
          .reduce((sum, t) => sum + Math.abs(Number(t.points_change || 0)), 0),
        average_points_per_transaction: transactions.length > 0 
          ? transactions.reduce((sum, t) => sum + Math.abs(Number(t.points_change || 0)), 0) / transactions.length 
          : 0,
        most_redeemed_category: "", // This would need to be calculated from reward categories
        redemption_rate: totalRedeemed.length > 0 ? (totalRedeemed.filter(r => r.status === "completed").length / totalRedeemed.length) * 100 : 0,
        last_redemption_date: totalRedeemed.length > 0 ? totalRedeemed[0].redeemed_at : null,
        last_earn_date: transactions.length > 0 ? transactions[0].created_at : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return SupabaseCustomerRewardMapper.toCustomerRewardStatsEntity(statsData);
    } catch (error) {
      if (error instanceof ShopCustomerRewardError) {
        throw error;
      }

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.OPERATION_FAILED,
        "Failed to get customer reward stats",
        "SupabaseCustomerRewardRepository.getCustomerRewardStats",
        { shopId, customerId },
        error
      );
    }
  }

  /**
   * Get customer information for rewards
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

      // Get customer basic info - for now, we'll return a simplified structure
      // In a real implementation, this would fetch from a customers table
      const customerInfo = {
        customerName: `Customer ${customerId}`,
        memberSince: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
      };

      return customerInfo;
    } catch (error) {
      if (error instanceof ShopCustomerRewardError) {
        throw error;
      }

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.OPERATION_FAILED,
        "Failed to get customer info",
        "SupabaseCustomerRewardRepository.getCustomerInfo",
        { shopId, customerId },
        error
      );
    }
  }
}
