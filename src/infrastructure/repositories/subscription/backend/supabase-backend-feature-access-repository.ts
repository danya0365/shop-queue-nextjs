import { DatabaseDataSource, QueryOptions, FilterOperator, SortDirection } from "@/src/domain/interfaces/datasources/database-datasource";
import { Logger } from "@/src/domain/interfaces/logger";
import { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import { 
  BackendSubscriptionError, 
  BackendSubscriptionErrorType, 
  BackendFeatureAccessRepository
} from "@/src/domain/repositories/subscription/backend/backend-subscription-repository";
import { 
  FeatureAccessEntity,
  PaginatedFeatureAccessEntity,
  FeatureType
} from "@/src/domain/entities/subscription/backend/backend-subscription.entity";
import { SupabaseBackendSubscriptionMapper } from "@/src/infrastructure/mappers/subscription/backend/supabase-backend-subscription.mapper";
import { 
  FeatureAccessSchema
} from "@/src/infrastructure/schemas/subscription/backend/subscription.schema";
import { StandardRepository } from "../../base/standard-repository";

/**
 * Supabase implementation of Feature Access Repository
 * Following Clean Architecture and SOLID principles
 */
export class SupabaseBackendFeatureAccessRepository extends StandardRepository implements BackendFeatureAccessRepository {
  constructor(
    dataSource: DatabaseDataSource,
    logger: Logger
  ) {
    super(dataSource, logger, "BackendFeatureAccess");
  }

  /**
   * Get paginated feature access
   */
  async getPaginatedFeatureAccess(params: PaginationParams): Promise<PaginatedFeatureAccessEntity> {
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
        this.dataSource.getAdvanced<Record<string, unknown> & FeatureAccessSchema>('feature_access', queryOptions),
        this.dataSource.count('feature_access', { filters: queryOptions.filters })
      ]);

      const featureAccessEntities = data.map(access => 
        SupabaseBackendSubscriptionMapper.featureAccessSchemaToEntity(access as FeatureAccessSchema)
      );

      const paginationMeta = SupabaseBackendSubscriptionMapper.createPaginationMeta(
        queryOptions.pagination!.page!,
        queryOptions.pagination!.limit!,
        totalCount
      );

      return {
        data: featureAccessEntities,
        pagination: paginationMeta
      };
    } catch (error) {
      this.logger.error('Error in getPaginatedFeatureAccess', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        params
      });
      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.OPERATION_FAILED,
        'Failed to get paginated feature access',
        'getPaginatedFeatureAccess'
      );
    }
  }

  /**
   * Get feature access by profile ID
   */
  async getFeatureAccessByProfileId(
    profileId: string,
    params: PaginationParams
  ): Promise<PaginatedFeatureAccessEntity> {
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
        this.dataSource.getAdvanced<Record<string, unknown> & FeatureAccessSchema>('feature_access', queryOptions),
        this.dataSource.count('feature_access', { filters: queryOptions.filters })
      ]);

      const featureAccessEntities = data.map(access => 
        SupabaseBackendSubscriptionMapper.featureAccessSchemaToEntity(access as FeatureAccessSchema)
      );

      const paginationMeta = SupabaseBackendSubscriptionMapper.createPaginationMeta(
        queryOptions.pagination!.page!,
        queryOptions.pagination!.limit!,
        totalCount
      );

      return {
        data: featureAccessEntities,
        pagination: paginationMeta
      };
    } catch (error) {
      this.logger.error('Error in getFeatureAccessByProfileId', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        profileId,
        params
      });
      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.OPERATION_FAILED,
        'Failed to get feature access by profile ID',
        'getFeatureAccessByProfileId'
      );
    }
  }

  /**
   * Check if profile has access to feature
   */
  async hasFeatureAccess(
    profileId: string,
    featureType: string,
    shopId?: string
  ): Promise<boolean> {
    try {
      const queryOptions: QueryOptions = {
        filters: [
          {
            field: 'profile_id',
            operator: FilterOperator.EQ,
            value: profileId
          },
          {
            field: 'feature_type',
            operator: FilterOperator.EQ,
            value: featureType
          },
          {
            field: 'is_active',
            operator: FilterOperator.EQ,
            value: true
          }
        ]
      };

      if (shopId) {
        queryOptions.filters!.push({
          field: 'shop_id',
          operator: FilterOperator.EQ,
          value: shopId
        });
      }

      const data = await this.dataSource.getAdvanced<Record<string, unknown> & FeatureAccessSchema>('feature_access', queryOptions);

      return data.length > 0;
    } catch (error) {
      this.logger.error('Error in hasFeatureAccess', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        profileId, 
        featureType, 
        shopId 
      });
      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.OPERATION_FAILED,
        'Failed to check feature access',
        'hasFeatureAccess'
      );
    }
  }

  /**
   * Grant feature access to profile
   */
  async grantFeatureAccess(
    profileId: string,
    featureType: FeatureType,
    featureId: string,
    price?: number,
    expiresAt?: string
  ): Promise<FeatureAccessEntity> {
    try {
      const accessData = {
        profile_id: profileId,
        feature_type: featureType,
        feature_id: featureId,
        price: price || 0,
        granted_at: new Date().toISOString(),
        expires_at: expiresAt || null,
        is_active: true
      };

      const insertedData = await this.dataSource.insert<Record<string, unknown> & FeatureAccessSchema>(
        'feature_access',
        accessData
      );

      if (!insertedData || insertedData.length === 0) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.OPERATION_FAILED,
          'Failed to insert feature access record',
          'grantFeatureAccess'
        );
      }

      return SupabaseBackendSubscriptionMapper.featureAccessSchemaToEntity(insertedData[0] as FeatureAccessSchema);
    } catch (error) {
      this.logger.error('Error in grantFeatureAccess', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        profileId, 
        featureType,
        featureId,
        price,
        expiresAt
      });
      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.OPERATION_FAILED,
        'Failed to grant feature access',
        'grantFeatureAccess'
      );
    }
  }

  /**
   * Revoke feature access from profile
   */
  async revokeFeatureAccess(
    profileId: string,
    featureType: string,
    shopId?: string
  ): Promise<boolean> {
    try {
      // First, find the feature access records to revoke
      const queryOptions: QueryOptions = {
        filters: [
          {
            field: 'profile_id',
            operator: FilterOperator.EQ,
            value: profileId
          },
          {
            field: 'feature_type',
            operator: FilterOperator.EQ,
            value: featureType
          },
          {
            field: 'is_active',
            operator: FilterOperator.EQ,
            value: true
          }
        ]
      };

      if (shopId) {
        queryOptions.filters!.push({
          field: 'shop_id',
          operator: FilterOperator.EQ,
          value: shopId
        });
      }

      const featureAccessRecords = await this.dataSource.getAdvanced<Record<string, unknown> & FeatureAccessSchema>(
        'feature_access',
        queryOptions
      );

      if (featureAccessRecords.length === 0) {
        return false;
      }

      // Update each record individually
      const updateData = { 
        is_active: false,
        updated_at: new Date().toISOString()
      };

      let updatedCount = 0;
      for (const record of featureAccessRecords) {
        try {
          await this.dataSource.update<Record<string, unknown> & FeatureAccessSchema>(
            'feature_access',
            record.id,
            updateData
          );
          updatedCount++;
        } catch (updateError) {
          this.logger.warn('Failed to update individual feature access record', {
            recordId: record.id,
            error: updateError instanceof Error ? updateError.message : 'Unknown error'
          });
        }
      }

      return updatedCount > 0;
    } catch (error) {
      this.logger.error('Error in revokeFeatureAccess', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        profileId, 
        featureType, 
        shopId 
      });
      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.OPERATION_FAILED,
        'Failed to revoke feature access',
        'revokeFeatureAccess'
      );
    }
  }
}
