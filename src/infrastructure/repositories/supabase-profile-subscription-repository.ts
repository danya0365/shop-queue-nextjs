import {
  CreateProfileSubscriptionEntity,
  PaginatedProfileSubscriptionsEntity,
  ProfileSubscriptionEntity,
  UpdateProfileSubscriptionEntity
} from "@/src/domain/entities/backend/backend-subscription.entity";
import { DatabaseDataSource, FilterOperator, QueryOptions, SortDirection } from "@/src/domain/interfaces/datasources/database-datasource";
import { Logger } from "@/src/domain/interfaces/logger";
import { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import {
  ProfileSubscriptionRepository,
  SubscriptionError,
  SubscriptionErrorType
} from "@/src/domain/repositories/subscription-repository";
import { SupabaseBackendSubscriptionMapper } from "@/src/infrastructure/mappers/backend/supabase-backend-subscription.mapper";
import { ProfileSubscriptionSchema } from "@/src/infrastructure/schemas/subscription/backend/subscription.schema";
import { StandardRepository } from "./base/standard-repository";

// Extended types for joined data
type ProfileSubscriptionSchemaRecord = Record<string, unknown> & ProfileSubscriptionSchema;

/**
 * Supabase implementation of Profile Subscription Repository
 * Following Clean Architecture and SOLID principles
 */
export class SupabaseProfileSubscriptionRepository extends StandardRepository implements ProfileSubscriptionRepository {
  constructor(
    dataSource: DatabaseDataSource,
    logger: Logger
  ) {
    super(dataSource, logger, "ProfileSubscription");
  }

  /**
   * Get paginated profile subscriptions
   */
  async getPaginatedSubscriptions(params: PaginationParams, profileId?: string): Promise<PaginatedProfileSubscriptionsEntity> {
    try {
      const { page, limit } = params;
      const offset = (page - 1) * limit;

      const queryOptions: QueryOptions = {
        select: ['*'],
        sort: [{ field: 'created_at', direction: SortDirection.DESC }],
        pagination: {
          limit,
          offset
        }
      };

      if (profileId) {
        queryOptions.filters = [{ field: 'profile_id', operator: FilterOperator.EQ, value: profileId }];
      }

      const profileSubscriptions = await this.dataSource.getAdvanced<ProfileSubscriptionSchemaRecord>(
        'profile_subscriptions',
        queryOptions
      );

      const totalItems = await this.dataSource.count('profile_subscriptions', queryOptions);

      const entities = profileSubscriptions.map((subscription: ProfileSubscriptionSchema) =>
        SupabaseBackendSubscriptionMapper.profileSubscriptionSchemaToEntity(subscription)
      );

      const pagination = SupabaseBackendSubscriptionMapper.createPaginationMeta(page, limit, totalItems);

      return {
        data: entities,
        pagination
      };
    } catch (error) {
      this.logger.error('Error getting paginated profile subscriptions', { params, profileId, error });
      throw error instanceof SubscriptionError ? error : new SubscriptionError(
        SubscriptionErrorType.UNKNOWN,
        'Failed to get paginated profile subscriptions',
        'getPaginatedSubscriptions',
        { params, profileId }
      );
    }
  }

  /**
   * Get profile subscription by ID
   */
  async getSubscriptionById(id: string): Promise<ProfileSubscriptionEntity | null> {
    try {
      this.logger.info('Getting profile subscription by ID', { id });

      const queryOptions: QueryOptions = {
        select: ['*'],
        filters: [{ field: 'id', operator: FilterOperator.EQ, value: id }],
        pagination: { limit: 1 }
      };

      const results = await this.dataSource.getAdvanced<ProfileSubscriptionSchemaRecord>(
        'profile_subscriptions',
        queryOptions
      );

      if (!results || results.length === 0) {
        return null;
      }

      return SupabaseBackendSubscriptionMapper.profileSubscriptionSchemaToEntity(results[0]);
    } catch (error) {
      this.logger.error('Error getting profile subscription by ID', { id, error });
      throw error instanceof SubscriptionError ? error : new SubscriptionError(
        SubscriptionErrorType.UNKNOWN,
        'Failed to get profile subscription by ID',
        'getSubscriptionById',
        { id }
      );
    }
  }

  /**
   * Get active subscription by profile ID
   */
  async getActiveSubscriptionByProfileId(profileId: string): Promise<ProfileSubscriptionEntity | null> {
    try {
      this.logger.info('Getting active subscription by profile ID', { profileId });

      const queryOptions: QueryOptions = {
        select: ['*'],
        filters: [
          { field: 'profile_id', operator: FilterOperator.EQ, value: profileId },
          { field: 'status', operator: FilterOperator.EQ, value: 'active' }
        ],
        sort: [{ field: 'created_at', direction: SortDirection.DESC }],
        pagination: { limit: 1 }
      };

      const results = await this.dataSource.getAdvanced<ProfileSubscriptionSchemaRecord>(
        'profile_subscriptions',
        queryOptions
      );

      if (!results || results.length === 0) {
        return null;
      }

      return SupabaseBackendSubscriptionMapper.profileSubscriptionSchemaToEntity(results[0]);
    } catch (error) {
      this.logger.error('Error getting active subscription by profile ID', { profileId, error });
      throw error instanceof SubscriptionError ? error : new SubscriptionError(
        SubscriptionErrorType.UNKNOWN,
        'Failed to get active subscription by profile ID',
        'getActiveSubscriptionByProfileId',
        { profileId }
      );
    }
  }

  /**
   * Get subscription history by profile ID
   */
  async getSubscriptionHistoryByProfileId(profileId: string, params: PaginationParams): Promise<PaginatedProfileSubscriptionsEntity> {
    try {
      this.logger.info('Getting subscription history by profile ID', { profileId, params });

      const { page, limit } = params;
      const offset = (page - 1) * limit;

      const queryOptions: QueryOptions = {
        select: ['*'],
        filters: [{ field: 'profile_id', operator: FilterOperator.EQ, value: profileId }],
        sort: [{ field: 'created_at', direction: SortDirection.DESC }],
        pagination: {
          limit,
          offset
        }
      };

      const profileSubscriptions = await this.dataSource.getAdvanced<ProfileSubscriptionSchemaRecord>(
        'profile_subscriptions',
        queryOptions
      );

      const totalItems = await this.dataSource.count('profile_subscriptions', queryOptions);

      const entities = profileSubscriptions.map((subscription: ProfileSubscriptionSchema) =>
        SupabaseBackendSubscriptionMapper.profileSubscriptionSchemaToEntity(subscription)
      );

      const pagination = SupabaseBackendSubscriptionMapper.createPaginationMeta(page, limit, totalItems);

      return {
        data: entities,
        pagination
      };
    } catch (error) {
      this.logger.error('Error getting subscription history by profile ID', { profileId, params, error });
      throw error instanceof SubscriptionError ? error : new SubscriptionError(
        SubscriptionErrorType.UNKNOWN,
        'Failed to get subscription history by profile ID',
        'getSubscriptionHistoryByProfileId',
        { profileId, params }
      );
    }
  }

  /**
   * Create new profile subscription
   */
  async createSubscription(subscription: CreateProfileSubscriptionEntity): Promise<ProfileSubscriptionEntity> {
    try {
      this.logger.info('Creating profile subscription', { subscription });

      const subscriptionData = SupabaseBackendSubscriptionMapper.createProfileSubscriptionEntityToSchema(subscription);

      const result = await this.dataSource.insert<ProfileSubscriptionSchemaRecord>(
        'profile_subscriptions',
        subscriptionData
      );

      return SupabaseBackendSubscriptionMapper.profileSubscriptionSchemaToEntity(result);
    } catch (error) {
      this.logger.error('Error creating profile subscription', { subscription, error });
      throw error instanceof SubscriptionError ? error : new SubscriptionError(
        SubscriptionErrorType.OPERATION_FAILED,
        'Failed to create profile subscription',
        'createSubscription',
        { subscription }
      );
    }
  }

  /**
   * Update profile subscription
   */
  async updateSubscription(id: string, subscription: Partial<UpdateProfileSubscriptionEntity>): Promise<ProfileSubscriptionEntity> {
    try {
      this.logger.info('Updating profile subscription', { id, subscription });

      const updateData = SupabaseBackendSubscriptionMapper.updateProfileSubscriptionEntityToSchema(subscription);

      const result = await this.dataSource.update<ProfileSubscriptionSchemaRecord>(
        'profile_subscriptions',
        id,
        updateData
      );

      return SupabaseBackendSubscriptionMapper.profileSubscriptionSchemaToEntity(result);
    } catch (error) {
      this.logger.error('Error updating profile subscription', { id, subscription, error });
      throw error instanceof SubscriptionError ? error : new SubscriptionError(
        SubscriptionErrorType.OPERATION_FAILED,
        'Failed to update profile subscription',
        'updateSubscription',
        { id, subscription }
      );
    }
  }

  /**
   * Cancel a profile subscription
   */
  async cancelSubscription(id: string): Promise<ProfileSubscriptionEntity> {
    try {
      const updateData = {
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const updatedData = await this.dataSource.update<Record<string, unknown> & ProfileSubscriptionSchema>(
        'profile_subscriptions',
        id,
        updateData
      );

      if (!updatedData) {
        throw new SubscriptionError(
          SubscriptionErrorType.NOT_FOUND,
          'Profile subscription not found',
          'cancelSubscription'
        );
      }

      return SupabaseBackendSubscriptionMapper.profileSubscriptionSchemaToEntity(updatedData);
    } catch (error) {
      this.logger.error('Error in cancelSubscription', {
        error: error instanceof Error ? error.message : 'Unknown error',
        id
      });
      throw new SubscriptionError(
        SubscriptionErrorType.OPERATION_FAILED,
        'Failed to cancel profile subscription',
        'cancelSubscription'
      );
    }
  }

  /**
   * Delete a profile subscription
   */
  async deleteSubscription(id: string): Promise<boolean> {
    try {
      await this.dataSource.delete('profile_subscriptions', id);
      return true;
    } catch (error) {
      this.logger.error('Error in deleteSubscription', {
        error: error instanceof Error ? error.message : 'Unknown error',
        id
      });
      throw new SubscriptionError(
        SubscriptionErrorType.OPERATION_FAILED,
        'Failed to delete profile subscription',
        'deleteSubscription'
      );
    }
  }
}
