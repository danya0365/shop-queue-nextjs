import { RewardType } from "@/src/domain/entities/shop/backend/backend-reward.entity";
import type {
  AvailableRewardEntity,
  CustomerPointsEntity,
  CustomerRewardEntity,
  CustomerRewardStatsEntity,
  RewardTransactionEntity,
} from "@/src/domain/entities/shop/customer/customer-reward.entity";
import {
  DatabaseDataSource,
  FilterOperator,
  QueryOptions,
} from "@/src/domain/interfaces/datasources/database-datasource";
import type { Logger } from "@/src/domain/interfaces/logger";
import type { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import {
  ShopCustomerRewardError,
  ShopCustomerRewardErrorType,
  ShopCustomerRewardRepository,
} from "@/src/domain/repositories/shop/customer/customer-reward-repository";
import { SupabaseCustomerRewardMapper } from "@/src/infrastructure/mappers/shop/customer/supabase-customer-reward-mapper";
import {
  CustomerRewardSchema,
  GetAvailableRewardsSchema,
  GetCustomerPointsSchema,
  RewardTransactionSchema,
  RewardUsageSchema,
} from "@/src/infrastructure/schemas/shop/customer/customer-reward.schema";
import { StandardRepository } from "../../base/standard-repository";

type CustomerRewardSchemaRecord = Record<string, unknown> &
  CustomerRewardSchema;
type RewardTransactionSchemaRecord = Record<string, unknown> &
  RewardTransactionSchema;

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
  async getCustomerPoints(
    shopId: string,
    customerId: string
  ): Promise<CustomerPointsEntity> {
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

      this.logger.info("Getting customer points via RPC", {
        shopId,
        customerId,
      });

      // Call the RPC function
      const results = await this.dataSource.callRpc<GetCustomerPointsSchema[]>(
        "get_customer_points",
        {
          p_shop_id: shopId,
          p_customer_id: customerId,
        }
      );

      if (!results) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.OPERATION_FAILED,
          "Failed to get customer points",
          "SupabaseCustomerRewardRepository.getCustomerPoints",
          { shopId, customerId }
        );
      }

      const result = results?.[0]; // Get the first result

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
  async getAvailableRewards(
    params: PaginationParams & {
      shopId: string;
      filters?: {
        category?: string;
        isAvailable?: boolean;
        minPointsCost?: number;
        maxPointsCost?: number;
      };
    }
  ): Promise<{
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
      const { shopId, page = 1, limit = 10, filters } = params;

      if (!shopId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "SupabaseCustomerRewardRepository.getAvailableRewards",
          { shopId }
        );
      }

      this.logger.info("Getting available rewards", {
        shopId,
        page,
        limit,
        filters,
      });
      // Call RPCs to bypass RLS safely and get proper pagination metadata
      const rpcParamsForList = {
        p_shop_id: shopId,
        p_category: filters?.category ?? null,
        p_is_available: filters?.isAvailable ?? null,
        p_min_points_cost: filters?.minPointsCost ?? null,
        p_max_points_cost: filters?.maxPointsCost ?? null,
        p_page: page,
        p_limit: limit,
      } as const;

      const rpcParamsForCount = {
        p_shop_id: shopId,
        p_category: filters?.category ?? null,
        p_is_available: filters?.isAvailable ?? null,
        p_min_points_cost: filters?.minPointsCost ?? null,
        p_max_points_cost: filters?.maxPointsCost ?? null,
      } as const;

      // Fetch list
      const rewards = await this.dataSource.callRpc<
        GetAvailableRewardsSchema[]
      >("get_available_rewards", rpcParamsForList);

      // Fetch count
      const totalItems = await this.dataSource.callRpc<number>(
        "get_available_rewards_count",
        rpcParamsForCount
      );

      const availableRewards = (rewards ?? []).map(
        (reward: GetAvailableRewardsSchema) =>
          SupabaseCustomerRewardMapper.toAvailableRewardEntity(reward)
      );

      const totalPages = Math.max(1, Math.ceil((totalItems || 0) / limit));

      return {
        data: availableRewards,
        pagination: {
          currentPage: page,
          perPage: limit,
          totalItems: totalItems || availableRewards.length,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
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
        {
          shopId: params.shopId,
          page: params.page,
          limit: params.limit,
          filters: params.filters,
        },
        error
      );
    }
  }

  /**
   * Get redeemed rewards with pagination and filters
   * @param params Pagination parameters with filters
   * @returns Paginated redeemed rewards data
   */
  async getRedeemedRewards(
    params: PaginationParams & {
      shopId: string;
      customerId: string;
      filters?: {
        category?: string;
        type?: RewardType;
        dateRange?: "all" | "month" | "quarter" | "year" | "custom";
        startDate?: string;
        endDate?: string;
      };
    }
  ): Promise<{
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

      this.logger.info("Getting redeemed rewards via RPC (reward_usages)", {
        shopId,
        customerId,
        page,
        limit,
        filters,
      });

      // Compute date range params for RPC (only supported filter we use here)
      let p_start_date: string | null = null;
      let p_end_date: string | null = null;
      if (filters && filters.dateRange && filters.dateRange !== "all") {
        const now = new Date();
        let startDate: Date;
        let endDate: Date;
        switch (filters.dateRange) {
          case "month":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            break;
          case "quarter":
            {
              const quarter = Math.floor(now.getMonth() / 3);
              startDate = new Date(now.getFullYear(), quarter * 3, 1);
              endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
            }
            break;
          case "year":
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31);
            break;
          case "custom":
            startDate = filters.startDate ? new Date(filters.startDate) : now;
            endDate = filters.endDate ? new Date(filters.endDate) : now;
            break;
          default:
            startDate = now;
            endDate = now;
        }
        p_start_date = startDate.toISOString();
        p_end_date = endDate.toISOString();
      }

      // RPC params strictly limited to reward_usages columns and supported filters
      const listParams = {
        p_shop_id: shopId,
        p_customer_id: customerId,
        p_start_date,
        p_end_date,
        p_page: page,
        p_limit: limit,
      } as const;

      const countParams = {
        p_shop_id: shopId,
        p_customer_id: customerId,
        p_start_date,
        p_end_date,
      } as const;

      const rows = await this.dataSource.callRpc<RewardUsageSchema[]>(
        "get_redeemed_rewards",
        listParams
      );

      const totalItems = await this.dataSource.callRpc<number>(
        "get_redeemed_rewards_count",
        countParams
      );

      const data = (rows ?? []).map((r) =>
        SupabaseCustomerRewardMapper.fromRewardUsageToCustomerRewardEntity(r)
      );

      const total = totalItems || data.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));

      return {
        data,
        pagination: {
          currentPage: page,
          perPage: limit,
          totalItems: total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
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
        filters: params.filters,
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
  async getRewardTransactions(
    params: PaginationParams & {
      shopId: string;
      customerId: string;
      filters?: {
        type?: "earned" | "redeemed" | "expired";
        dateRange?: "all" | "month" | "quarter" | "year" | "custom";
        startDate?: string;
        endDate?: string;
      };
    }
  ): Promise<{
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

      this.logger.info(
        "Getting reward transactions via VIEW RPC (reward_transactions_view)",
        {
          shopId,
          customerId,
          page,
          limit,
          filters,
        }
      );

      // Build date range for RPC
      let p_start_date: string | null = null;
      let p_end_date: string | null = null;
      if (filters && filters.dateRange && filters.dateRange !== "all") {
        const now = new Date();
        let startDate: Date;
        let endDate: Date;
        switch (filters.dateRange) {
          case "month":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            break;
          case "quarter": {
            const quarter = Math.floor(now.getMonth() / 3);
            startDate = new Date(now.getFullYear(), quarter * 3, 1);
            endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
            break;
          }
          case "year":
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31);
            break;
          case "custom":
            startDate = filters.startDate ? new Date(filters.startDate) : now;
            endDate = filters.endDate ? new Date(filters.endDate) : now;
            break;
          default:
            startDate = now;
            endDate = now;
        }
        p_start_date = startDate.toISOString();
        p_end_date = endDate.toISOString();
      }

      const p_type = filters?.type ?? null;

      const listParams = {
        p_shop_id: shopId,
        p_customer_id: customerId,
        p_type,
        p_start_date,
        p_end_date,
        p_page: page,
        p_limit: limit,
      } as const;

      const countParams = {
        p_shop_id: shopId,
        p_customer_id: customerId,
        p_type,
        p_start_date,
        p_end_date,
      } as const;

      const rows = await this.dataSource.callRpc<
        import("@/src/domain/types/supabase").Database["public"]["Functions"]["get_reward_transactions_enriched"]["Returns"]
      >("get_reward_transactions_enriched", listParams);

      const totalItems = await this.dataSource.callRpc<number>(
        "get_reward_transactions_enriched_count",
        countParams
      );

      const data = (rows ?? []).map((r) =>
        SupabaseCustomerRewardMapper.fromRewardTransactionsViewToEntity({
          id: r.id ?? "",
          shop_id: r.shop_id ?? "",
          customer_id: r.customer_id ?? "",
          type:
            (r.type as import("@/src/domain/types/supabase").Database["public"]["Enums"]["transaction_type"]) ??
            null,
          points: r.points ?? 0,
          description: r.description ?? null,
          transaction_date: r.transaction_date ?? null,
          created_at: r.created_at ?? null,
          related_queue_id: r.related_queue_id ?? null,
          reward_id: r.reward_id ?? null,
          redemption_code: r.redemption_code ?? null,
          used_at: r.used_at ?? null,
        })
      );

      const total = totalItems || data.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));

      return {
        data,
        pagination: {
          currentPage: page,
          perPage: limit,
          totalItems: total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
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
        filters: params.filters,
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
    rewardId: string
  ): Promise<AvailableRewardEntity> {
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

      this.logger.info("Getting reward by ID", {
        shopId,
        rewardId,
      });

      // Call RPC to fetch single reward row
      const row = await this.dataSource.callRpc<
        import("@/src/domain/types/supabase").Database["public"]["Functions"]["get_reward_by_id"]["Returns"]
      >("get_reward_by_id", {
        p_shop_id: shopId,
        p_reward_id: rewardId,
      });

      if (!row) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.NOT_FOUND,
          "Reward not found",
          "SupabaseCustomerRewardRepository.getRewardById",
          { shopId, rewardId }
        );
      }

      const entity =
        SupabaseCustomerRewardMapper.fromRewardRowToAvailableRewardEntity({
          id: row.id ?? "",
          name: row.name ?? "",
          description: row.description ?? null,
          points_required: row.points_required ?? 0,
          shop_id: row.shop_id ?? "",
          type: row.type as RewardType,
          value: row.value ?? 0,
          created_at: row.created_at ?? null,
          updated_at: row.updated_at ?? null,
          expiry_days: row.expiry_days ?? null,
          icon: row.icon ?? null,
          is_available: row.is_available ?? null,
          usage_limit: row.usage_limit ?? null,
        });

      return entity;
    } catch (error) {
      if (error instanceof ShopCustomerRewardError) {
        throw error;
      }

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.OPERATION_FAILED,
        "Failed to get reward by ID",
        "SupabaseCustomerRewardRepository.getRewardById",
        { shopId, rewardId },
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
  async redeemReward(
    shopId: string,
    customerId: string,
    rewardId: string
  ): Promise<CustomerRewardEntity> {
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

      this.logger.info("Redeeming reward via RPC", {
        shopId,
        customerId,
        rewardId,
      });

      // Call the existing redeem_customer_reward RPC
      type RedeemResult = {
        success: boolean;
        error?: string;
        details?: string;
        data?: {
          redemption_id?: string;
          redemption_code?: string;
          reward_name?: string;
          reward_value?: number;
          points_used?: number;
          expires_at?: string | null;
          remaining_points?: number;
        };
      };

      const redeemResult = await this.dataSource.callRpc<
        import("@/src/domain/types/supabase").Database["public"]["Functions"]["redeem_customer_reward"]["Returns"]
      >("redeem_customer_reward", {
        p_shop_id: shopId,
        p_customer_id: customerId,
        p_reward_id: rewardId,
        p_redemption_type:
          "points_redemption" as import("@/src/domain/types/supabase").Database["public"]["Enums"]["redemption_type"],
        p_source_description: null,
        p_employee_id: null,
      });

      // redeemResult is Json; coerce to typed object
      const parsed: RedeemResult = (redeemResult as unknown) as RedeemResult;
      if (!parsed || parsed.success !== true || !parsed.data?.redemption_id) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.OPERATION_FAILED,
          parsed?.error || "Redeem RPC failed",
          "SupabaseCustomerRewardRepository.redeemReward",
          { shopId, customerId, rewardId, details: parsed?.details }
        );
      }

      const redemptionId = parsed.data.redemption_id;

      // Fetch the created reward_usage row to return a fully mapped entity
      const usageRow = await this.dataSource.callRpc<
        import("@/src/domain/types/supabase").Database["public"]["Functions"]["get_reward_usage_by_id"]["Returns"]
      >("get_reward_usage_by_id", { p_id: redemptionId });

      if (!usageRow) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.NOT_FOUND,
          "Redeemed reward usage not found",
          "SupabaseCustomerRewardRepository.redeemReward",
          { shopId, customerId, rewardId, redemptionId }
        );
      }

      const entity =
        SupabaseCustomerRewardMapper.fromRewardUsageToCustomerRewardEntity({
          id: usageRow.id,
          cancelled_at: usageRow.cancelled_at,
          cancelled_by_employee_id: usageRow.cancelled_by_employee_id,
          cancelled_reason: usageRow.cancelled_reason,
          created_at: usageRow.created_at,
          customer_id: usageRow.customer_id,
          customer_point_transaction_id:
            usageRow.customer_point_transaction_id,
          expires_at: usageRow.expires_at,
          issued_at: usageRow.issued_at,
          metadata: usageRow.metadata,
          notes: usageRow.notes,
          points_used: usageRow.points_used,
          redemption_code: usageRow.redemption_code,
          redemption_type: usageRow.redemption_type,
          reward_id: usageRow.reward_id,
          reward_value: usageRow.reward_value,
          shop_id: usageRow.shop_id,
          source_description: usageRow.source_description,
          status: usageRow.status,
          updated_at: usageRow.updated_at,
          used_at: usageRow.used_at,
          used_by_employee_id: usageRow.used_by_employee_id,
          used_queue_id: usageRow.used_queue_id,
        });

      return entity;
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
  async getCustomerRewardStats(
    shopId: string,
    customerId: string
  ): Promise<CustomerRewardStatsEntity> {
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

      const totalRedeemed =
        await this.dataSource.getAdvanced<CustomerRewardSchemaRecord>(
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

      const transactions =
        await this.dataSource.getAdvanced<RewardTransactionSchemaRecord>(
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
          .filter((t) => t.transaction_type === "redemption")
          .reduce((sum, t) => sum + Math.abs(Number(t.points_change || 0)), 0),
        average_points_per_transaction:
          transactions.length > 0
            ? transactions.reduce(
                (sum, t) => sum + Math.abs(Number(t.points_change || 0)),
                0
              ) / transactions.length
            : 0,
        most_redeemed_category: "", // This would need to be calculated from reward categories
        redemption_rate:
          totalRedeemed.length > 0
            ? (totalRedeemed.filter((r) => r.status === "completed").length /
                totalRedeemed.length) *
              100
            : 0,
        last_redemption_date:
          totalRedeemed.length > 0 ? totalRedeemed[0].redeemed_at : null,
        last_earn_date:
          transactions.length > 0 ? transactions[0].created_at : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return SupabaseCustomerRewardMapper.toCustomerRewardStatsEntity(
        statsData
      );
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
  async getCustomerInfo(
    shopId: string,
    customerId: string
  ): Promise<{
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
        memberSince: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD
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
