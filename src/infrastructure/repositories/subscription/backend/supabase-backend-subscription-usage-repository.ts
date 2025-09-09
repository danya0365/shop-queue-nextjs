import { DatabaseDataSource, QueryOptions, FilterOperator, SortDirection } from "@/src/domain/interfaces/datasources/database-datasource";
import { Logger } from "@/src/domain/interfaces/logger";
import { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import { 
  BackendSubscriptionError, 
  BackendSubscriptionErrorType, 
  BackendSubscriptionUsageRepository
} from "@/src/domain/repositories/subscription/backend/backend-subscription-repository";
import { 
  SubscriptionUsageEntity,
  CurrentUsageStatsEntity,
  PaginatedSubscriptionUsageEntity
} from "@/src/domain/entities/subscription/backend/backend-subscription.entity";
import { SupabaseBackendSubscriptionMapper } from "@/src/infrastructure/mappers/subscription/backend/supabase-backend-subscription.mapper";
import { 
  SubscriptionUsageSchema,
  CurrentUsageStatsSchema
} from "@/src/infrastructure/schemas/subscription/backend/subscription.schema";
import { StandardRepository } from "../../base/standard-repository";

/**
 * Supabase implementation of Subscription Usage Repository
 * Following Clean Architecture and SOLID principles
 */
export class SupabaseBackendSubscriptionUsageRepository extends StandardRepository implements BackendSubscriptionUsageRepository {
  constructor(
    dataSource: DatabaseDataSource,
    logger: Logger
  ) {
    super(dataSource, logger, "BackendSubscriptionUsage");
  }

  /**
   * Get paginated subscription usage
   */
  async getPaginatedUsage(params: PaginationParams): Promise<PaginatedSubscriptionUsageEntity> {
    try {
      const queryOptions: QueryOptions = {
        pagination: {
          page: params.page || 1,
          limit: params.limit || 10
        },
        sort: [{
          field: 'created_at',
          direction: SortDirection.DESC
        }],
        filters: []
      };

      const [data, totalCount] = await Promise.all([
        this.dataSource.getAdvanced<Record<string, unknown> & SubscriptionUsageSchema>('subscription_usage', queryOptions),
        this.dataSource.count('subscription_usage', { filters: queryOptions.filters })
      ]);

      const usageEntities = data.map(usage => 
        SupabaseBackendSubscriptionMapper.subscriptionUsageSchemaToEntity(usage as SubscriptionUsageSchema)
      );

      const paginationMeta = SupabaseBackendSubscriptionMapper.createPaginationMeta(
        queryOptions.pagination!.page!,
        queryOptions.pagination!.limit!,
        totalCount
      );

      return {
        data: usageEntities,
        pagination: paginationMeta
      };
    } catch (error) {
      this.logger.error('Error in getPaginatedUsage', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        params
      });
      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.OPERATION_FAILED,
        'Failed to get paginated subscription usage',
        'getPaginatedUsage'
      );
    }
  }

  /**
   * Get usage by profile ID
   */
  async getUsageByProfileId(profileId: string, params: PaginationParams): Promise<PaginatedSubscriptionUsageEntity> {
    try {
      const queryOptions: QueryOptions = {
        pagination: {
          page: params.page || 1,
          limit: params.limit || 10
        },
        sort: [{
          field: 'created_at',
          direction: SortDirection.DESC
        }],
        filters: [{
          field: 'profile_id',
          operator: FilterOperator.EQ,
          value: profileId
        }]
      };

      const [data, totalCount] = await Promise.all([
        this.dataSource.getAdvanced<Record<string, unknown> & SubscriptionUsageSchema>('subscription_usage', queryOptions),
        this.dataSource.count('subscription_usage', { filters: queryOptions.filters })
      ]);

      const usageEntities = data.map(usage => 
        SupabaseBackendSubscriptionMapper.subscriptionUsageSchemaToEntity(usage as SubscriptionUsageSchema)
      );

      const paginationMeta = SupabaseBackendSubscriptionMapper.createPaginationMeta(
        queryOptions.pagination!.page!,
        queryOptions.pagination!.limit!,
        totalCount
      );

      return {
        data: usageEntities,
        pagination: paginationMeta
      };
    } catch (error) {
      this.logger.error('Error in getUsageByProfileId', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        profileId,
        params
      });
      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.OPERATION_FAILED,
        'Failed to get usage by profile ID',
        'getUsageByProfileId'
      );
    }
  }

  /**
   * Get current usage stats for a profile
   */
  async getCurrentUsageStats(
    profileId: string,
    shopId?: string
  ): Promise<CurrentUsageStatsEntity> {
    try {
      // For now, calculate stats from existing usage data
      // In a real implementation, this might use a database view or RPC function
      const queryOptions: QueryOptions = {
        filters: [{
          field: 'profile_id',
          operator: FilterOperator.EQ,
          value: profileId
        }]
      };

      if (shopId) {
        queryOptions.filters!.push({
          field: 'shop_id',
          operator: FilterOperator.EQ,
          value: shopId
        });
      }

      const usageData = await this.dataSource.getAdvanced<Record<string, unknown> & SubscriptionUsageSchema>('subscription_usage', queryOptions);

      // Calculate stats from usage data
      const totalUsage = usageData.reduce((sum, usage) => sum + (Number(usage.usage_count) || 0), 0);
      const usageByType: Record<string, number> = {};
      
      usageData.forEach(usage => {
        if (usage.usage_type && typeof usage.usage_type === 'string') {
          usageByType[usage.usage_type] = (usageByType[usage.usage_type] || 0) + (Number(usage.usage_count) || 0);
        }
      });

      const lastUsageDate = usageData.length > 0 
        ? usageData.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())[0].created_at || null
        : null;

      return {
        profileId,
        shopId,
        todayQueues: usageByType['queue'] || 0,
        currentShops: usageByType['shop'] || 0,
        currentStaff: usageByType['staff'] || 0,
        monthlySmsSent: usageByType['sms'] || 0,
        activePromotions: usageByType['promotion'] || 0
      };
    } catch (error) {
      this.logger.error('Error in getCurrentUsageStats', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        profileId, 
        shopId 
      });
      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.OPERATION_FAILED,
        'Failed to get current usage stats',
        'getCurrentUsageStats'
      );
    }
  }

  /**
   * Record usage for a profile
   */
  async recordUsage(
    profileId: string,
    shopId: string | null,
    usageType: string,
    count: number
  ): Promise<SubscriptionUsageEntity> {
    try {
      const usageData = {
        profile_id: profileId,
        shop_id: shopId,
        usage_type: usageType,
        usage_count: count,
        usage_date: new Date().toISOString()
      };

      const insertedData = await this.dataSource.insert<Record<string, unknown> & SubscriptionUsageSchema>(
        'subscription_usage',
        usageData
      );

      if (!insertedData || insertedData.length === 0) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.OPERATION_FAILED,
          'Failed to insert usage record',
          'recordUsage'
        );
      }

      return SupabaseBackendSubscriptionMapper.subscriptionUsageSchemaToEntity(insertedData[0] as SubscriptionUsageSchema);
    } catch (error) {
      this.logger.error('Error in recordUsage', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        profileId, 
        shopId, 
        usageType, 
        count 
      });
      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.OPERATION_FAILED,
        'Failed to record usage',
        'recordUsage'
      );
    }
  }

  /**
   * Check if profile can perform an action
   */
  async canPerformAction(profileId: string, action: string, shopId?: string): Promise<boolean> {
    try {
      this.logger.info('Checking if action can be performed', { profileId, action, shopId });
      
      // For now, always return true - implement actual limit checking logic here
      // This would typically check against subscription plan limits
      // const stats = await this.getCurrentUsageStats(profileId, shopId);
      return true;
    } catch (error) {
      this.logger.error('Error checking if action can be performed', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        profileId, 
        action, 
        shopId
      });
      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.OPERATION_FAILED,
        'Failed to check if action can be performed',
        'canPerformAction'
      );
    }
  }
}
