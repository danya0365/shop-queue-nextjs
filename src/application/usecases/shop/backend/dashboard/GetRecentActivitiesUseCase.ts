import type { RecentActivityDTO } from '@/src/application/dtos/shop/backend/dashboard-stats-dto';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { ShopBackendDashboardRepository } from '@/src/domain/repositories/shop/backend/backend-dashboard-repository';

export interface IGetRecentActivitiesUseCase {
  execute(): Promise<RecentActivityDTO[]>;
}

export class GetRecentActivitiesUseCase implements IGetRecentActivitiesUseCase {
  constructor(
    private readonly dashboardRepository: ShopBackendDashboardRepository,
    private readonly logger: Logger
  ) { }

  async execute(): Promise<RecentActivityDTO[]> {
    try {
      this.logger.info('GetRecentActivitiesUseCase: Executing recent activities retrieval');

      // Get recent activities from repository
      const recentActivities = await this.dashboardRepository.getRecentActivities();

      // Map domain entities to DTOs
      const activities: RecentActivityDTO[] = recentActivities.map(activity => ({
        id: activity.id,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        createdAt: activity.created_at,
        metadata: activity.metadata
      }));

      this.logger.info('GetRecentActivitiesUseCase: Successfully retrieved recent activities');
      return activities;
    } catch (error) {
      this.logger.error('GetRecentActivitiesUseCase: Error retrieving recent activities', error);
      throw error;
    }
  }
}
