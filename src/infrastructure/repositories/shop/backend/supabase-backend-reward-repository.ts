import { CreateRewardEntity, PaginatedRewardsEntity, RewardEntity, RewardStatsEntity, RewardTypeStatsEntity, RewardUsageEntity } from "@/src/domain/entities/shop/backend/backend-reward.entity";
import { DatabaseDataSource, QueryOptions, SortDirection } from "@/src/domain/interfaces/datasources/database-datasource";
import { Logger } from "@/src/domain/interfaces/logger";
import { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import { ShopBackendRewardError, ShopBackendRewardErrorType, ShopBackendRewardRepository } from "@/src/domain/repositories/shop/backend/backend-reward-repository";
import { SupabaseShopBackendRewardMapper } from "@/src/infrastructure/mappers/shop/backend/supabase-backend-reward.mapper";
import { RewardSchema, RewardStatsSchema, RewardUsageSchema } from "@/src/infrastructure/schemas/shop/backend/reward.schema";
import { StandardRepository } from "../../base/standard-repository";

// Extended types for joined data
type RewardWithJoins = RewardSchema & {
  shops?: { name?: string }
};
type RewardSchemaRecord = Record<string, unknown> & RewardSchema;
type RewardStatsSchemaRecord = Record<string, unknown> & RewardStatsSchema;
type RewardUsageWithJoins = Record<string, unknown> & RewardUsageSchema & {
  customers?: { name?: string },
  rewards?: { name?: string, icon?: string },
  queues?: { queue_number?: string }
};

/**
 * Supabase implementation of the reward repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseShopBackendRewardRepository extends StandardRepository implements ShopBackendRewardRepository {
  constructor(
    dataSource: DatabaseDataSource,
    logger: Logger
  ) {
    super(dataSource, logger, "ShopBackendReward");
  }

  /**
   * Get paginated rewards data from database
   * @param params Pagination parameters
   * @returns Paginated rewards data
   */
  async getPaginatedRewards(params: PaginationParams): Promise<PaginatedRewardsEntity> {
    try {
      const { page, limit } = params;
      const offset = (page - 1) * limit;

      // Use getAdvanced with proper QueryOptions format
      const queryOptions: QueryOptions = {
        select: ['*'],
        joins: [
          { table: 'shops', on: { fromField: 'shop_id', toField: 'id' } }
        ],
        sort: [{ field: 'created_at', direction: SortDirection.DESC }],
        pagination: {
          limit,
          offset
        }
      };

      // Use extended type that satisfies Record<string, unknown> constraint
      const rewards = await this.dataSource.getAdvanced<RewardSchemaRecord>(
        'rewards',
        queryOptions
      );

      // Count total items
      const totalItems = await this.dataSource.count('rewards', queryOptions);

      // Map database results to domain entities
      const mappedRewards = rewards.map(reward => {
        // Handle joined data from shops table
        const rewardWithJoinedData = reward as RewardWithJoins;

        const rewardWithJoins = {
          ...reward,
          shop_name: rewardWithJoinedData.shops?.name
        };
        return SupabaseShopBackendRewardMapper.toDomain(rewardWithJoins);
      });

      // Create pagination metadata
      const pagination = SupabaseShopBackendRewardMapper.createPaginationMeta(page, limit, totalItems);

      return {
        data: mappedRewards,
        pagination
      };
    } catch (error) {
      if (error instanceof ShopBackendRewardError) {
        throw error;
      }

      this.logger.error('Error in getPaginatedRewards', { error });
      throw new ShopBackendRewardError(
        ShopBackendRewardErrorType.UNKNOWN,
        'An unexpected error occurred while fetching rewards',
        'getPaginatedRewards',
        {},
        error
      );
    }
  }

  /**
   * Get reward statistics from database
   * @returns Reward statistics
   */
  async getRewardStats(): Promise<RewardStatsEntity> {
    try {
      // Use getAdvanced to fetch statistics data
      const queryOptions: QueryOptions = {
        select: ['*'],
        // No joins needed for stats view
        // No pagination needed, we want all stats
      };

      // Assuming a view exists for reward statistics
      // Use extended type that satisfies Record<string, unknown> constraint
      const statsData = await this.dataSource.getAdvanced<RewardStatsSchemaRecord>(
        'reward_stats_summary_view',
        queryOptions
      );

      if (!statsData || statsData.length === 0) {
        // If no stats are found, return default values
        return {
          totalRewards: 0,
          activeRewards: 0,
          totalRedemptions: 0,
          totalPointsRedeemed: 0,
          averageRedemptionValue: 0,
          popularRewardType: null
        };
      }

      // Map database results to domain entity
      // Assuming the first record contains all stats
      return SupabaseShopBackendRewardMapper.statsToEntity(statsData[0]);
    } catch (error) {
      if (error instanceof ShopBackendRewardError) {
        throw error;
      }

      this.logger.error('Error in getRewardStats', { error });
      throw new ShopBackendRewardError(
        ShopBackendRewardErrorType.UNKNOWN,
        'An unexpected error occurred while fetching reward statistics',
        'getRewardStats',
        {},
        error
      );
    }
  }

  /**
   * Get reward type statistics from database
   * @returns Reward type statistics
   */
  async getRewardTypeStats(): Promise<RewardTypeStatsEntity> {
    try {
      // Use getAdvanced to fetch reward type statistics
      const queryOptions: QueryOptions = {
        pagination: {
          limit: 10,
          offset: 0
        }
      };

      interface TypeStatsResult extends Record<string, unknown> {
        discount: { count: number; percentage: number; totalValue: number };
        free_item: { count: number; percentage: number; totalValue: number };
        cashback: { count: number; percentage: number; totalValue: number };
        special_privilege: { count: number; percentage: number; totalValue: number };
        total_rewards: number;
      }

      const typeStatsDatas = await this.dataSource.getAdvanced<TypeStatsResult>(
        'reward_type_stats_summary_view',
        queryOptions
      );

      if (!typeStatsDatas || typeStatsDatas.length === 0) {
        // If no stats are found, return default values
        return {
          discount: { count: 0, percentage: 0, totalValue: 0 },
          free_item: { count: 0, percentage: 0, totalValue: 0 },
          cashback: { count: 0, percentage: 0, totalValue: 0 },
          special_privilege: { count: 0, percentage: 0, totalValue: 0 },
          totalRewards: 0
        };
      }

      const typeStatsData = typeStatsDatas[0];

      // Initialize default stats structure
      const defaultStats = {
        discount: { count: typeStatsData.discount.count, percentage: typeStatsData.discount.percentage, totalValue: typeStatsData.discount.totalValue },
        free_item: { count: typeStatsData.free_item.count, percentage: typeStatsData.free_item.percentage, totalValue: typeStatsData.free_item.totalValue },
        cashback: { count: typeStatsData.cashback.count, percentage: typeStatsData.cashback.percentage, totalValue: typeStatsData.cashback.totalValue },
        special_privilege: { count: typeStatsData.special_privilege.count, percentage: typeStatsData.special_privilege.percentage, totalValue: typeStatsData.special_privilege.totalValue },
        totalRewards: typeStatsData.total_rewards
      };

      return defaultStats;
    } catch (error) {
      if (error instanceof ShopBackendRewardError) {
        throw error;
      }

      this.logger.error('Error in getRewardTypeStats', { error });
      throw new ShopBackendRewardError(
        ShopBackendRewardErrorType.UNKNOWN,
        'An unexpected error occurred while fetching reward type statistics',
        'getRewardTypeStats',
        {},
        error
      );
    }
  }

  /**
   * Get recent reward usage
   * @param limit Number of recent usage records to fetch
   * @returns Array of reward usage entities
   */
  async getRecentRewardUsage(limit: number = 10): Promise<RewardUsageEntity[]> {
    try {
      // Use getAdvanced to fetch recent reward usage data
      const queryOptions: QueryOptions = {
        select: ['*'],
        joins: [
          { table: 'customers', on: { fromField: 'customer_id', toField: 'id' } },
          { table: 'rewards', on: { fromField: 'reward_id', toField: 'id' } },
          { table: 'queues', on: { fromField: 'queue_id', toField: 'id' } }
        ],
        sort: [{ field: 'used_at', direction: SortDirection.DESC }],
        pagination: {
          limit,
          offset: 0
        }
      };

      // Use extended type that satisfies Record<string, unknown> constraint
      const usageData = await this.dataSource.getAdvanced<RewardUsageWithJoins>(
        'reward_usages',
        queryOptions
      );

      // Map database results to domain entities
      return usageData.map(usage => {
        const usageWithJoinedData = usage as RewardUsageWithJoins;
        return SupabaseShopBackendRewardMapper.usageToDomain({
          ...usageWithJoinedData,
          reward_name: usageWithJoinedData.rewards?.name || '',
          reward_icon: usageWithJoinedData.rewards?.icon || '',
          customer_name: usageWithJoinedData.customers?.name || '',
          queue_number: usageWithJoinedData.queues?.queue_number || ''
        });
      });
    } catch (error) {
      if (error instanceof ShopBackendRewardError) {
        throw error;
      }

      this.logger.error('Error in getRecentRewardUsage', { error, limit });
      throw new ShopBackendRewardError(
        ShopBackendRewardErrorType.UNKNOWN,
        'An unexpected error occurred while fetching recent reward usage',
        'getRecentRewardUsage',
        { limit },
        error
      );
    }
  }

  /**
   * Get reward by ID
   * @param id Reward ID
   * @returns Reward entity or null if not found
   */
  async getRewardById(id: string): Promise<RewardEntity | null> {
    try {
      // Use getById which is designed for fetching by ID
      // Use extended type that satisfies Record<string, unknown> constraint
      const reward = await this.dataSource.getById<RewardSchemaRecord>(
        'rewards',
        id,
        {
          select: ['*'],
          joins: [
            { table: 'shops', on: { fromField: 'shop_id', toField: 'id' } }
          ]
        }
      );

      if (!reward) {
        return null;
      }

      // Handle joined data from shops table
      const rewardWithJoinedData = reward as RewardWithJoins;

      const rewardWithJoins = {
        ...reward,
        shop_name: rewardWithJoinedData.shops?.name
      };

      // Map database result to domain entity
      return SupabaseShopBackendRewardMapper.toDomain(rewardWithJoins);
    } catch (error) {
      if (error instanceof ShopBackendRewardError) {
        throw error;
      }

      this.logger.error('Error in getRewardById', { error, id });
      throw new ShopBackendRewardError(
        ShopBackendRewardErrorType.UNKNOWN,
        'An unexpected error occurred while fetching reward',
        'getRewardById',
        { id },
        error
      );
    }
  }

  /**
   * Create a new reward
   * @param reward Reward data to create
   * @returns Created reward entity
   */
  async createReward(reward: Omit<CreateRewardEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<RewardEntity> {
    try {
      // Convert domain entity to database schema
      const rewardSchema = {
        shop_id: reward.shopId,
        name: reward.name,
        description: reward.description || null,
        type: reward.type,
        points_required: reward.pointsRequired,
        value: reward.value,
        is_available: reward.isAvailable ?? true,
        expiry_days: reward.expiryDays || null,
        usage_limit: reward.usageLimit || null,
        icon: reward.icon || null
      };

      // Create reward in database
      const createdReward = await this.dataSource.insert<RewardSchemaRecord>(
        'rewards',
        rewardSchema
      );

      if (!createdReward) {
        throw new ShopBackendRewardError(
          ShopBackendRewardErrorType.OPERATION_FAILED,
          'Failed to create reward',
          'createReward',
          { reward }
        );
      }

      // Get the created reward with joined data
      return this.getRewardById(createdReward.id) as Promise<RewardEntity>;
    } catch (error) {
      if (error instanceof ShopBackendRewardError) {
        throw error;
      }

      this.logger.error('Error in createReward', { error, reward });
      throw new ShopBackendRewardError(
        ShopBackendRewardErrorType.UNKNOWN,
        'An unexpected error occurred while creating reward',
        'createReward',
        { reward },
        error
      );
    }
  }

  /**
   * Update an existing reward
   * @param id Reward ID
   * @param reward Reward data to update
   * @returns Updated reward entity
   */
  async updateReward(id: string, reward: Partial<Omit<RewardEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<RewardEntity> {
    try {
      // Check if reward exists
      const existingReward = await this.getRewardById(id);
      if (!existingReward) {
        throw new ShopBackendRewardError(
          ShopBackendRewardErrorType.NOT_FOUND,
          `Reward with ID ${id} not found`,
          'updateReward',
          { id, reward }
        );
      }

      // Convert domain entity to database schema
      const rewardSchema: Partial<RewardSchema> = {};
      if (reward.name !== undefined) rewardSchema.name = reward.name;
      if (reward.description !== undefined) rewardSchema.description = reward.description;
      if (reward.type !== undefined) rewardSchema.type = reward.type;
      if (reward.pointsRequired !== undefined) rewardSchema.points_required = reward.pointsRequired;
      if (reward.value !== undefined) rewardSchema.value = reward.value;
      if (reward.isAvailable !== undefined) rewardSchema.is_available = reward.isAvailable;
      if (reward.expiryDays !== undefined) rewardSchema.expiry_days = reward.expiryDays;
      if (reward.usageLimit !== undefined) rewardSchema.usage_limit = reward.usageLimit;
      if (reward.icon !== undefined) rewardSchema.icon = reward.icon;

      // Update reward in database
      const updatedReward = await this.dataSource.update<RewardSchemaRecord>(
        'rewards',
        id,
        rewardSchema
      );

      if (!updatedReward) {
        throw new ShopBackendRewardError(
          ShopBackendRewardErrorType.OPERATION_FAILED,
          'Failed to update reward',
          'updateReward',
          { id, reward }
        );
      }

      // Get the updated reward with joined data
      return this.getRewardById(id) as Promise<RewardEntity>;
    } catch (error) {
      if (error instanceof ShopBackendRewardError) {
        throw error;
      }

      this.logger.error('Error in updateReward', { error, id, reward });
      throw new ShopBackendRewardError(
        ShopBackendRewardErrorType.UNKNOWN,
        'An unexpected error occurred while updating reward',
        'updateReward',
        { id, reward },
        error
      );
    }
  }

  /**
   * Delete a reward
   * @param id Reward ID
   * @returns true if deleted successfully
   */
  async deleteReward(id: string): Promise<boolean> {
    try {
      // Check if reward exists
      const existingReward = await this.getRewardById(id);
      if (!existingReward) {
        throw new ShopBackendRewardError(
          ShopBackendRewardErrorType.NOT_FOUND,
          `Reward with ID ${id} not found`,
          'deleteReward',
          { id }
        );
      }

      // Delete reward from database
      await this.dataSource.delete(
        'rewards',
        id
      );

      // Since we've already checked if the reward exists, we can return true
      return true;
    } catch (error) {
      if (error instanceof ShopBackendRewardError) {
        throw error;
      }

      this.logger.error('Error in deleteReward', { error, id });
      throw new ShopBackendRewardError(
        ShopBackendRewardErrorType.UNKNOWN,
        'An unexpected error occurred while deleting reward',
        'deleteReward',
        { id },
        error
      );
    }
  }
}
