import type { GlobalRecentActivityDTO } from '@/src/application/dtos/dashboard/global-dashboard-dto';
import { GlobalDashboardError } from '@/src/domain/errors/global-dashboard-error';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { GlobalDashboardRepository } from '@/src/domain/repositories/dashboard/global-dashboard-repository';

/**
 * Get Global Recent Activities Use Case Interface
 */
export interface IGetGlobalRecentActivitiesUseCase {
  execute(profileId: string, limit?: number): Promise<GlobalRecentActivityDTO[]>;
}

/**
 * Get Global Recent Activities Use Case
 * Retrieves recent activities across all shops owned by a user
 */
export class GetGlobalRecentActivitiesUseCase implements IGetGlobalRecentActivitiesUseCase {
  constructor(
    private readonly repository: GlobalDashboardRepository,
    private readonly logger: Logger
  ) {}

  async execute(profileId: string, limit: number = 10): Promise<GlobalRecentActivityDTO[]> {
    try {
      // Validate input
      if (!profileId || profileId.trim() === '') {
        throw GlobalDashboardError.validationError('Profile ID is required');
      }

      if (limit < 1 || limit > 100) {
        throw GlobalDashboardError.validationError('Limit must be between 1 and 100');
      }

      this.logger.info('GetGlobalRecentActivitiesUseCase: Executing for profile', {
        profileId,
        limit,
      });

      // Get activities from repository
      const activities = await this.repository.getRecentActivities(profileId, limit);

      this.logger.info('GetGlobalRecentActivitiesUseCase: Successfully retrieved activities', {
        profileId,
        count: activities.length,
      });

      // Map entities to DTOs
      return activities.map(activity => ({
        id: activity.id,
        shopId: activity.shopId,
        shopName: activity.shopName,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        metadata: activity.metadata,
        createdAt: activity.createdAt,
      }));
    } catch (error) {
      this.logger.error('GetGlobalRecentActivitiesUseCase: Error executing use case', error);
      
      if (error instanceof GlobalDashboardError) {
        throw error;
      }
      
      throw GlobalDashboardError.unknown(
        'Failed to get global recent activities',
        error
      );
    }
  }
}
